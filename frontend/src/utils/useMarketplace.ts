import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  skillsOffered: string[];
  skillsSought: string[];
  category: string | null;
  sessionFormat: string | null;
  timeValue: string | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    subscriptionTier?: string | null;
    profile: {
      experienceLevel: string | null;
      availability: string | null;
    } | null;
  };
}

export interface MarketplaceStats {
  completedSwaps: number;
  activeSwaps: number;
  uniqueSkillDomains: number;
  successRate: number;
}

export function useMarketplace() {
  const { getToken, user } = useAuth();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const getAccessToken = () => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    return token;
  };

  // Stats fetching
  const fetchStats = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${apiUrl}/api/marketplace/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Listings fetching
  const fetchListings = useCallback(async (resetPage = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const currentPage = resetPage ? 1 : page;
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      if (searchQuery) queryParams.append('search', searchQuery);
      if (category) queryParams.append('category', category);

      const res = await fetch(`${apiUrl}/api/marketplace/listings?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to fetch listings');
      const data = await res.json();
      
      setListings(prev => resetPage ? data.data : [...prev, ...data.data]);
      setHasMore(data.page < data.pages);
      if (resetPage) setPage(1);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, category, user]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, category, fetchListings]);

  // Initial stats fetch
  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [fetchStats, user]);

  const requestSwap = async (listingId: string, message: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${apiUrl}/api/marketplace/swap-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ listingId, message })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to request swap');
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Swap request failed');
      return false;
    }
  };

  return {
    listings,
    stats,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    loadMore,
    hasMore,
    requestSwap,
    fetchListings
  };
}
