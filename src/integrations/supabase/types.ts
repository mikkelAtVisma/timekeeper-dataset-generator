export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      datasets: {
        Row: {
          created_at: string
          end_date: string
          id: string
          registrations: Json
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          registrations: Json
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          registrations?: Json
          start_date?: string
        }
        Relationships: []
      }
      employee_patterns: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          pattern: Json
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          pattern: Json
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          pattern?: Json
        }
        Relationships: []
      }
      time_registrations: {
        Row: {
          break_duration: number
          created_at: string
          date: string
          department_id: string
          employee_id: string
          end_time: number
          id: string
          project_id: string
          public_holiday: boolean | null
          start_time: number
          work_category: string
          work_duration: number
        }
        Insert: {
          break_duration: number
          created_at?: string
          date: string
          department_id: string
          employee_id: string
          end_time: number
          id?: string
          project_id: string
          public_holiday?: boolean | null
          start_time: number
          work_category: string
          work_duration: number
        }
        Update: {
          break_duration?: number
          created_at?: string
          date?: string
          department_id?: string
          employee_id?: string
          end_time?: number
          id?: string
          project_id?: string
          public_holiday?: boolean | null
          start_time?: number
          work_category?: string
          work_duration?: number
        }
        Relationships: []
      }
      timedetect_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          customer_id: string
          dataset_id: string | null
          id: string
          job_id: string
          presigned_url: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          customer_id: string
          dataset_id?: string | null
          id?: string
          job_id: string
          presigned_url: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          dataset_id?: string | null
          id?: string
          job_id?: string
          presigned_url?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
