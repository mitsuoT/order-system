"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "ja" | "ko"

interface Translations {
  systemTitle: string
  version: string
  selectUserType: string
  selectUserTypeDescription: string
  wholesaleApp: string
  wholesaleAppDescription: string
  restaurantApp: string
  restaurantAppDescription: string
  enterWholesaleApp: string
  enterRestaurantApp: string
  systemFeatures: string
  wholesaleFeatures: string
  restaurantFeatures: string
  productManagement: string
  inventoryManagement: string
  orderManagement: string
  pcaIntegration: string
  profitAnalysis: string
  productCatalog: string
  easyOrdering: string
  orderHistory: string
  realTimeInventory: string
  multiLanguageSupport: string
  backToHome: string
  productManagementDescription: string
  orderManagementDescription: string
  profitAnalysisDescription: string
  productOrdering: string
  productOrderingDescription: string
  orderHistoryDescription: string
  wholesaleManagement: string
  wholesaleDescription: string
  restaurantOrdering: string
  restaurantDescription: string
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
  taxCategory: string
  remarks: string
  salesDate: string
  amount: string
  costPrice: string
  packSize: string
  productImage: string
  profit: string
  profitRate: string
  customerManagement: string
  customerManagementDescription: string
  supplierManagement: string
  supplierManagementDescription: string
  topicManagement: string
  topicManagementDescription: string
  topics: string
  addTopic: string
  editTopic: string
  title: string
  content: string
  priority: string
  publishDate: string
  expiryDate: string
  active: string
  inactive: string
  high: string
  medium: string
  low: string
  news: string
  promotion: string
  maintenance: string
  announcement: string
  searchProducts: string
  allCategories: string
  searchPlaceholder: string
  productsFound: string
  selectSupplier: string
  noSupplierSelected: string
  supplierRequired: string
}

const translations: Record<Language, Translations> = {
  ja: {
    systemTitle: "食材受発注システム",
    version: "v1.0",
    selectUserType: "ユーザータイプを選択",
    selectUserTypeDescription: "卸会社または飲食店のアプリを選択してください",
    wholesaleApp: "卸会社アプリ",
    wholesaleAppDescription: "商品管理・受注管理・利益分析",
    restaurantApp: "飲食店アプリ",
    restaurantAppDescription: "商品注文・注文履歴確認",
    enterWholesaleApp: "卸会社アプリに入る",
    enterRestaurantApp: "飲食店アプリに入る",
    systemFeatures: "システム機能",
    wholesaleFeatures: "卸会社向け機能",
    restaurantFeatures: "飲食店向け機能",
    productManagement: "商品管理",
    inventoryManagement: "在庫管理",
    orderManagement: "受注管理",
    pcaIntegration: "PCA連携",
    profitAnalysis: "利益分析",
    productCatalog: "商品カタログ",
    easyOrdering: "簡単注文",
    orderHistory: "注文履歴",
    realTimeInventory: "リアルタイム在庫",
    multiLanguageSupport: "多言語対応",
    backToHome: "ホームに戻る",
    productManagementDescription: "商品登録・編集・在庫管理",
    orderManagementDescription: "注文確認・ステータス管理・PCA連携",
    profitAnalysisDescription: "利益率分析・収益性レポート",
    productOrdering: "商品注文",
    productOrderingDescription: "商品カタログから注文",
    orderHistoryDescription: "過去の注文履歴確認",
    wholesaleManagement: "卸会社管理",
    wholesaleDescription: "商品登録・在庫管理",
    restaurantOrdering: "飲食店注文",
    restaurantDescription: "商品注文・履歴確認",
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
    taxCategory: "税区分",
    remarks: "備考",
    salesDate: "売上日付",
    amount: "金額",
    costPrice: "原価",
    packSize: "入数",
    productImage: "商品画像",
    profit: "利益",
    profitRate: "利益率",
    customerManagement: "得意先管理",
    customerManagementDescription: "飲食店との取引関係管理",
    supplierManagement: "仕入先管理",
    supplierManagementDescription: "卸会社との取引関係管理",
    topicManagement: "トピック管理",
    topicManagementDescription: "お知らせ・ニュースの管理",
    topics: "お知らせ・ニュース",
    addTopic: "トピック追加",
    editTopic: "トピック編集",
    title: "タイトル",
    content: "内容",
    priority: "優先度",
    publishDate: "公開日",
    expiryDate: "終了日",
    active: "有効",
    inactive: "無効",
    high: "重要",
    medium: "通常",
    low: "参考",
    news: "ニュース",
    promotion: "プロモーション",
    maintenance: "メンテナンス",
    announcement: "お知らせ",
    searchProducts: "商品検索",
    allCategories: "全カテゴリー",
    searchPlaceholder: "商品名・商品コードで検索",
    productsFound: "件の商品が見つかりました",
    selectSupplier: "仕入先を選択",
    noSupplierSelected: "仕入先が選択されていません",
    supplierRequired: "仕入先の選択は必須です",
  },
  ko: {
    systemTitle: "식자재 수발주 시스템",
    version: "v1.0",
    selectUserType: "사용자 유형 선택",
    selectUserTypeDescription: "도매업체 또는 음식점 앱을 선택해주세요",
    wholesaleApp: "도매업체 앱",
    wholesaleAppDescription: "상품관리・수주관리・이익분석",
    restaurantApp: "음식점 앱",
    restaurantAppDescription: "상품주문・주문이력확인",
    enterWholesaleApp: "도매업체 앱 입장",
    enterRestaurantApp: "음식점 앱 입장",
    systemFeatures: "시스템 기능",
    wholesaleFeatures: "도매업체용 기능",
    restaurantFeatures: "음식점용 기능",
    productManagement: "상품관리",
    inventoryManagement: "재고관리",
    orderManagement: "수주관리",
    pcaIntegration: "PCA연계",
    profitAnalysis: "이익분석",
    productCatalog: "상품카탈로그",
    easyOrdering: "간편주문",
    orderHistory: "주문이력",
    realTimeInventory: "실시간재고",
    multiLanguageSupport: "다국어지원",
    backToHome: "홈으로 돌아가기",
    productManagementDescription: "상품등록・편집・재고관리",
    orderManagementDescription: "주문확인・상태관리・PCA연계",
    profitAnalysisDescription: "이익률분석・수익성리포트",
    productOrdering: "상품주문",
    productOrderingDescription: "상품카탈로그에서 주문",
    orderHistoryDescription: "과거 주문이력 확인",
    wholesaleManagement: "도매업체 관리",
    wholesaleDescription: "상품등록・재고관리",
    restaurantOrdering: "음식점 주문",
    restaurantDescription: "상품주문・이력확인",
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
    taxCategory: "세금구분",
    remarks: "비고",
    salesDate: "매출일자",
    amount: "금액",
    costPrice: "원가",
    packSize: "입수",
    productImage: "상품이미지",
    profit: "이익",
    profitRate: "이익률",
    customerManagement: "거래처관리",
    customerManagementDescription: "음식점과의 거래관계 관리",
    supplierManagement: "공급업체관리",
    supplierManagementDescription: "도매업체와의 거래관계 관리",
    topicManagement: "토픽관리",
    topicManagementDescription: "공지사항・뉴스 관리",
    topics: "공지사항・뉴스",
    addTopic: "토픽추가",
    editTopic: "토픽편집",
    title: "제목",
    content: "내용",
    priority: "우선순위",
    publishDate: "공개일",
    expiryDate: "종료일",
    active: "활성",
    inactive: "비활성",
    high: "중요",
    medium: "보통",
    low: "참고",
    news: "뉴스",
    promotion: "프로모션",
    maintenance: "점검",
    announcement: "공지사항",
    searchProducts: "상품검색",
    allCategories: "전체 카테고리",
    searchPlaceholder: "상품명・상품코드로 검색",
    productsFound: "개의 상품을 찾았습니다",
    selectSupplier: "공급업체 선택",
    noSupplierSelected: "공급업체가 선택되지 않았습니다",
    supplierRequired: "공급업체 선택은 필수입니다",
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
