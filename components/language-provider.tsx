"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "ja" | "ko"

interface Translations {
  systemTitle: string
  version: string
  wholesaleManagement: string
  wholesaleDescription: string
  restaurantOrdering: string
  restaurantDescription: string
  orderManagement: string
  orderDescription: string
  productCode: string
  productName: string
  category: string
  unitPrice: string
  stock: string
  unit: string
  actions: string
  add: string
  edit: string
  delete: string
  save: string
  cancel: string
  quantity: string
  total: string
  order: string
  orderDate: string
  customerCode: string
  customerName: string
  status: string
  pending: string
  confirmed: string
  shipped: string
  delivered: string
  exportCSV: string
  pcaExport: string
  vegetables: string
  meat: string
  seafood: string
  dairy: string
  grains: string
  condiments: string
  kg: string
  piece: string
  pack: string
  liter: string
  addProduct: string
  editProduct: string
  addToCart: string
  cart: string
  checkout: string
  orderHistory: string
  taxCategory: string
  remarks: string
  salesDate: string
  amount: string
  costPrice: string
  packSize: string
  productImage: string
  profit: string
  profitRate: string
}

const translations: Record<Language, Translations> = {
  ja: {
    systemTitle: "食材受発注システム",
    version: "v1.0",
    wholesaleManagement: "卸会社管理",
    wholesaleDescription: "商品登録・在庫管理",
    restaurantOrdering: "飲食店注文",
    restaurantDescription: "商品注文・履歴確認",
    orderManagement: "受注管理",
    orderDescription: "注文確認・PCA連携",
    productCode: "商品コード",
    productName: "商品名",
    category: "カテゴリー",
    unitPrice: "単価",
    stock: "在庫数",
    unit: "単位",
    actions: "操作",
    add: "追加",
    edit: "編集",
    delete: "削除",
    save: "保存",
    cancel: "キャンセル",
    quantity: "数量",
    total: "合計",
    order: "注文",
    orderDate: "注文日",
    customerCode: "得意先コード",
    customerName: "得意先名",
    status: "ステータス",
    pending: "受注待ち",
    confirmed: "確認済み",
    shipped: "出荷済み",
    delivered: "配送完了",
    exportCSV: "CSV出力",
    pcaExport: "PCA商魂連携",
    vegetables: "野菜",
    meat: "肉類",
    seafood: "魚介類",
    dairy: "乳製品",
    grains: "穀物",
    condiments: "調味料",
    kg: "kg",
    piece: "個",
    pack: "パック",
    liter: "L",
    addProduct: "商品追加",
    editProduct: "商品編集",
    addToCart: "カートに追加",
    cart: "カート",
    checkout: "注文確定",
    orderHistory: "注文履歴",
    taxCategory: "税区分",
    remarks: "備考",
    salesDate: "売上日付",
    amount: "金額",
    costPrice: "原価",
    packSize: "入数",
    productImage: "商品画像",
    profit: "利益",
    profitRate: "利益率",
  },
  ko: {
    systemTitle: "식자재 수발주 시스템",
    version: "v1.0",
    wholesaleManagement: "도매업체 관리",
    wholesaleDescription: "상품등록・재고관리",
    restaurantOrdering: "음식점 주문",
    restaurantDescription: "상품주문・이력확인",
    orderManagement: "수주관리",
    orderDescription: "주문확인・PCA연계",
    productCode: "상품코드",
    productName: "상품명",
    category: "카테고리",
    unitPrice: "단가",
    stock: "재고수",
    unit: "단위",
    actions: "조작",
    add: "추가",
    edit: "편집",
    delete: "삭제",
    save: "저장",
    cancel: "취소",
    quantity: "수량",
    total: "합계",
    order: "주문",
    orderDate: "주문일",
    customerCode: "거래처코드",
    customerName: "거래처명",
    status: "상태",
    pending: "수주대기",
    confirmed: "확인완료",
    shipped: "출하완료",
    delivered: "배송완료",
    exportCSV: "CSV출력",
    pcaExport: "PCA상혼연계",
    vegetables: "채소",
    meat: "육류",
    seafood: "수산물",
    dairy: "유제품",
    grains: "곡물",
    condiments: "조미료",
    kg: "kg",
    piece: "개",
    pack: "팩",
    liter: "L",
    addProduct: "상품추가",
    editProduct: "상품편집",
    addToCart: "장바구니 추가",
    cart: "장바구니",
    checkout: "주문확정",
    orderHistory: "주문이력",
    taxCategory: "세금구분",
    remarks: "비고",
    salesDate: "매출일자",
    amount: "금액",
    costPrice: "원가",
    packSize: "입수",
    productImage: "상품이미지",
    profit: "이익",
    profitRate: "이익률",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ja")

  const value = {
    language,
    setLanguage,
    t: translations[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
