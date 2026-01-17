import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api-client';
import type { LoginCredentials } from '@/types/auth';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // React Query: Fetch current user
  const { data: authData, isLoading: isLoadingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query: Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data);
    },
  });

  // React Query: Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
    },
  });

  return {
    user: authData?.user ?? null,
    isLoading: isLoadingAuth || loginMutation.isPending || logoutMutation.isPending,
    isAuthenticated: !!authData?.user,
    error: loginMutation.error || logoutMutation.error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
};
