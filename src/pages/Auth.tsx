
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from 'react-i18next';

const Auth = () => {
  const { t } = useTranslation();
  
  const formSchema = z.object({
    email: z.string().email({ message: t('auth.validation.email') }),
    password: z.string().min(6, { message: t('auth.validation.password') }),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
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

        navigate("/");
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
