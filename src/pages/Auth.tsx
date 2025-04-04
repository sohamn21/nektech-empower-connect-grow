
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("entrepreneur");
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginSchema = z.object({
    email: z.string().email({ message: t('auth.validation.email') }),
    password: z.string().min(6, { message: t('auth.validation.password') }),
  });

  const signupSchema = z.object({
    email: z.string().email({ message: t('auth.validation.email') }),
    password: z.string().min(6, { message: t('auth.validation.password') }),
    name: z.string().min(2, { message: t('auth.validation.name') }),
    role: z.enum(["entrepreneur", "hub_manager", "buyer", "csr"]),
    preferredLanguage: z.string(),
    phone: z.string().optional(),
  });

  // Extended schemas for different roles
  const entrepreneurSchema = signupSchema.extend({
    aadharNumber: z.string().min(12, { message: t('auth.validation.aadhar') }),
    occupation: z.string().min(2, { message: t('auth.validation.occupation') }),
    familyIncome: z.string().transform(val => Number(val)),
  });

  const hubManagerSchema = signupSchema.extend({
    hubName: z.string().min(2, { message: t('auth.validation.hubName') }),
    location: z.string().min(2, { message: t('auth.validation.location') }),
  });

  const buyerSchema = signupSchema.extend({
    companyName: z.string().optional(),
    businessType: z.string().optional(),
  });

  const csrSchema = signupSchema.extend({
    organizationName: z.string().min(2, { message: t('auth.validation.orgName') }),
    registrationNumber: z.string().min(2, { message: t('auth.validation.regNumber') }),
  });

  // Get the appropriate schema based on selected role
  const getSchemaForRole = () => {
    if (authMode === "login") return loginSchema;

    switch (selectedRole) {
      case "entrepreneur": return entrepreneurSchema;
      case "hub_manager": return hubManagerSchema;
      case "buyer": return buyerSchema;
      case "csr": return csrSchema;
      default: return signupSchema;
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getSchemaForRole()),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "entrepreneur",
      preferredLanguage: i18n.language || "en",
      phone: "",
      aadharNumber: "",
      occupation: "",
      familyIncome: "",
      hubName: "",
      location: "",
      companyName: "",
      businessType: "",
      organizationName: "",
      registrationNumber: "",
    },
  });

  // Update form validation when role changes
  useState(() => {
    form.reset({
      ...form.getValues(),
      role: selectedRole,
    });
  }, [selectedRole]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (authMode === "signup") {
        // Prepare user metadata based on role
        let metaData: any = {
          name: values.name,
          role: selectedRole,
          preferredLanguage: values.preferredLanguage,
          phone: values.phone || null,
        };

        switch (selectedRole) {
          case "entrepreneur":
            metaData = {
              ...metaData,
              aadharNumber: values.aadharNumber,
              occupation: values.occupation,
              familyIncome: Number(values.familyIncome),
              hubManagerPermission: false,
            };
            break;
          case "hub_manager":
            metaData = {
              ...metaData,
              hubName: values.hubName,
              location: values.location,
              managedEntrepreneurs: [],
            };
            break;
          case "buyer":
            metaData = {
              ...metaData,
              companyName: values.companyName || null,
              businessType: values.businessType || null,
            };
            break;
          case "csr":
            metaData = {
              ...metaData,
              organizationName: values.organizationName,
              registrationNumber: values.registrationNumber,
              supportedInitiatives: [],
            };
            break;
        }

        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: metaData,
          }
        });

        if (error) throw error;

        toast({
          title: t('auth.signup.success.title'),
          description: t('auth.signup.success.description'),
        });

        // Switch to login mode after signup
        setAuthMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;

        toast({
          title: t('auth.login.success.title'),
          description: t('auth.login.success.description'),
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth.error.title'),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-8 p-8 bg-background rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {authMode === "login" ? t('auth.login.title') : t('auth.signup.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {authMode === "login"
              ? t('auth.login.subtitle')
              : t('auth.signup.subtitle')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Common fields for both login and signup */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.form.email')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('auth.form.emailPlaceholder')}
                      type="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.form.password')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('auth.form.passwordPlaceholder')}
                      type="password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fields only for signup */}
            {authMode === "signup" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.form.name')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('auth.form.namePlaceholder')}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.form.phone')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('auth.form.phonePlaceholder')}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.form.language')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('auth.form.selectLanguage')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                          <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.form.userType')}</FormLabel>
                      <Select 
                        onValueChange={(value: any) => {
                          field.onChange(value);
                          setSelectedRole(value as UserRole);
                        }} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('auth.form.selectUserType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entrepreneur">{t('auth.roles.entrepreneur')}</SelectItem>
                          <SelectItem value="hub_manager">{t('auth.roles.hubManager')}</SelectItem>
                          <SelectItem value="buyer">{t('auth.roles.buyer')}</SelectItem>
                          <SelectItem value="csr">{t('auth.roles.csr')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role-specific fields */}
                {selectedRole === "entrepreneur" && (
                  <>
                    <FormField
                      control={form.control}
                      name="aadharNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.entrepreneur.aadhar')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.entrepreneur.aadharPlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.entrepreneur.occupation')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.entrepreneur.occupationPlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="familyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.entrepreneur.income')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.entrepreneur.incomePlaceholder')}
                              type="number"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {selectedRole === "hub_manager" && (
                  <>
                    <FormField
                      control={form.control}
                      name="hubName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.hubManager.hubName')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.hubManager.hubNamePlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.hubManager.location')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.hubManager.locationPlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {selectedRole === "buyer" && (
                  <>
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.buyer.company')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.buyer.companyPlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.buyer.businessType')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.buyer.businessTypePlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {selectedRole === "csr" && (
                  <>
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.csr.organization')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.csr.organizationPlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('auth.form.csr.registrationNumber')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('auth.form.csr.registrationNumberPlaceholder')}
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.form.processing') : authMode === "login" ? t('auth.form.signIn') : t('auth.form.signUp')}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          >
            {authMode === "login" ? t('auth.switchToSignup') : t('auth.switchToLogin')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
