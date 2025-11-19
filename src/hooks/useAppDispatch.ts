// src/hooks/useAppDispatch.ts
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store';

// {‹„ useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
