
import { Database as OriginalDatabase } from './types';

// Extend the original Database type with the user_interactions table
export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      user_interactions: {
        Row: {
          id: string;
          phone_number: string | null;
          intent: string;
          user_input: string | null;
          language: string;
          timestamp: string;
          additional_data: any | null;
        };
        Insert: {
          id?: string;
          phone_number?: string | null;
          intent: string;
          user_input?: string | null;
          language?: string;
          timestamp?: string;
          additional_data?: any | null;
        };
        Update: {
          id?: string;
          phone_number?: string | null;
          intent?: string;
          user_input?: string | null;
          language?: string;
          timestamp?: string;
          additional_data?: any | null;
        };
        Relationships: [];
      };
    } & OriginalDatabase['public']['Tables'];
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}
