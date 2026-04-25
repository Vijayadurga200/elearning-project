import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export interface AnalyticsData {
  visually_impaired_users: number;
  hearing_impaired_users: number;
  total_users: number;
  completion_rates: {
    voice_navigation: number;
    subtitles: number;
    sign_language: number;
    tts: number;
  };
  feature_usage: {
    voice_commands: number;
    subtitles: number;
    text_to_speech: number;
  };
}

export const useAnalytics = () => {
  const { request, loading } = useApi();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const fetchAnalytics = async () => {
    const data = await request<AnalyticsData>('/api/analytics');
    if (data) {
      setAnalytics(data);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics,
  };
};