export interface Website {
  id: string;
  name: string;
  url: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  tracking_code?: string;
  visitor_count?: number;
  pageview_count?: number;
  is_active?: boolean;
}
