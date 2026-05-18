import * as FileSystem from 'expo-file-system/legacy';
import Anthropic from '@anthropic-ai/sdk';
import { Category, CATEGORIES } from '../../../shared/types';

export interface ExtractedReceiptData {
  amount?: string;    // whole VND as string, e.g. "45000"
  category?: Category;
  note?: string;      // tên cửa hàng hoặc mô tả ngắn, tối đa 50 ký tự
}

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `Bạn là trợ lý đọc hoá đơn. Phân tích ảnh hoá đơn và trích xuất:
1. Tổng tiền thanh toán (số nguyên VND, không có dấu chấm phẩy, ví dụ: 45000)
2. Danh mục chi tiêu — chọn đúng 1 trong: ${CATEGORIES.join(', ')}
3. Tên cửa hàng hoặc mô tả ngắn (tối đa 50 ký tự)

Chỉ trả về JSON hợp lệ, không có text thêm:
{"amount":"45000","category":"Ăn uống","note":"Phở Hà Nội"}

Nếu không xác định được trường nào, bỏ trường đó khỏi JSON.`;

export async function extractReceiptData(photoUri: string): Promise<ExtractedReceiptData | null> {
  try {
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
            },
            { type: 'text', text: SYSTEM_PROMPT },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text.trim() : '';

    // Extract JSON block (in case model wraps with extra text)
    const jsonMatch = text.match(/\{[^}]+\}/s);
    if (!jsonMatch) return null;

    const json = JSON.parse(jsonMatch[0]);
    const result: ExtractedReceiptData = {};

    if (typeof json.amount === 'string' && /^\d+$/.test(json.amount.trim())) {
      result.amount = json.amount.trim();
    }
    if (typeof json.category === 'string' && CATEGORIES.includes(json.category.trim())) {
      result.category = json.category.trim() as Category;
    }
    if (typeof json.note === 'string' && json.note.trim().length > 0) {
      result.note = json.note.trim().substring(0, 50);
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    // Graceful degradation — user fills manually
    return null;
  }
}
