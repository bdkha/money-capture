import { useState, useCallback, useEffect } from 'react';
import { AppCategory } from '../types';
import {
  loadCategories,
  addCategory as addCategoryStorage,
  deleteCategory as deleteCategoryStorage,
  updateCategoryName as updateCategoryNameStorage,
} from '../database/categoryStorage';
import { useI18n } from '../i18n/I18nContext';

export function useCategories() {
  const [categories, setCategories] = useState<AppCategory[]>([]);
  const { t } = useI18n();

  const load = useCallback(() => {
    setCategories(loadCategories());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getDisplayName = useCallback(
    (cat: AppCategory): string => {
      if (cat.kind === 'default') {
        return (t.categories as Record<string, string>)[cat.key] ?? cat.key;
      }
      return cat.key;
    },
    [t],
  );

  const add = useCallback(async (input: { key: string; emoji: string; color: string }) => {
    const updated = await addCategoryStorage(input);
    setCategories(updated);
  }, []);

  const remove = useCallback(async (id: string) => {
    const updated = await deleteCategoryStorage(id);
    setCategories(updated);
  }, []);

  const rename = useCallback(async (id: string, name: string) => {
    const updated = await updateCategoryNameStorage(id, name);
    setCategories(updated);
  }, []);

  return { categories, getDisplayName, add, remove, rename };
}
