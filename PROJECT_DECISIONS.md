# Prompt Gemini Fotos - 项目决策文档

## 项目概述
AI摄影prompt SaaS平台，帮助用户使用优化的提示词通过Gemini AI生成专业级摄影作品�?
## 核心需求决�?
### 用户痛点洞察
- **目标用户**: 个人用户（内容创作者、摄影爱好者、社交媒体用户）
- **核心需�?*: 快速获得专业级摄影效果，但缺乏专业技能和复杂prompt编写能力
- **解决方案**: 提供智能prompt生成�?+ AI图像生成 + 专业模板�?
### 市场定位
- **主要市场**: 巴西（葡萄牙语为默认语言�?- **扩展市场**: 斯里兰卡、印度、菲律宾、巴基斯坦、印尼、中�?- **搜索趋势**:
  - "prompt gemini ensaio fotográfico" +4150%
  - "prompt gemini foto profissional" +3950%
  - "prompt gemini casal" +4050%

## 技术决�?
### 前端架构
- **框架**: Next.js 15 (最新版�?
- **路由**: App Router
- **样式**: Tailwind CSS + shadcn/ui
- **语言**: TypeScript
- **构建工具**: Turbopack

### 后端架构
- **数据�?*: Supabase (PostgreSQL)
- **认证**: Google OAuth (优先)，使用NextAuth.js v5
- **支付**: Creem 支付平台
- **AI模型**: Gemini最新版�?(通过OpenRouter接入)
- **图片存储**: Cloudflare R2 + CDN
- **部署**: Vercel (自动CI/CD)

### 多语言支持
- **�?*: next-intl
- **路由策略**:
  - 默认路径 `/` �?巴西葡萄牙语 (pt-BR)
  - 其他语言: `/en/`, `/zh-CN/`, `/hi/`, `/id/`, `/tl/`
- **支持语言**: 6�?  1. pt-BR (巴西葡萄牙语) - 默认
  2. en (英语)
  3. zh-CN (简体中�?
  4. hi (印地�?
  5. id (印尼�?
  6. tl (他加禄语/菲律宾语)

### 数据库设�?(Supabase)
```sql
-- 用户�?users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  subscription_status TEXT, -- 'free', 'pro'
  free_generations_used INTEGER DEFAULT 0,
  free_generations_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- 生成记录�?generations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  original_image_url TEXT,
  generated_image_url TEXT,
  prompt_text TEXT,
  category TEXT, -- 'portrait', 'couple', 'professional'
  style TEXT, -- 'dramatic', 'natural', 'cinematic'
  resolution TEXT, -- '512x512', '1024x1024'
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)

-- 订阅�?subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  creem_subscription_id TEXT,
  status TEXT, -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP
)

-- 模板�?templates (
  id UUID PRIMARY KEY,
  name TEXT,
  description TEXT,
  category TEXT,
  style TEXT,
  prompt_template TEXT,
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP
)
```

## 付费策略决策

### 免费�?(引流获客)
```
�?总限�? 5次生�?(账户生命周期，无每日重置)
�?分辨�? 512x512
�?基础模板: 15�?�?社区浏览: 仅查�?�?水印: "Made with PromptGeminiPhotos.com"
�?客服支持: 仅FAQ自助
💰 成本控制: 每用户最�?$0.10 (5�?× $0.02)
```

### 专业�?(主要营收)
```
💎 月付: $7.99/�?💎 年付: $79.99/�?(节省17%，月�?6.67)

�?无限制生�?�?高分辨率: 1024x1024
�?专业模板�? 100+
�?批量处理: 最�?0�?�?�?无水印下�?�?私人作品画廊
�?社区上传分享权限
�?优先邮件客服 (24小时内回�?
�?提前体验新功�?�?导出原始prompt文本
```

### 成本分析
```
免费用户成本: 5�?× $0.02 = $0.10 (一次�?
付费用户预估: 100�?�?× $0.05 = $5.00成本
专业版收�? $7.99/�?净利润: $2.99 (37%毛利�?
```

## SEO优化决策

### 关键词策�?- **主词密度**: 3%左右
  - "prompt gemini ensaio fotográfico"
  - "prompt gemini foto profissional"
  - "prompt gemini casal"
- **相关搜索�?*: 每个至少出现1�?  - "prompt para foto profissional gemini"
  - "prompts gemini fotos"

### 技术SEO
- **动态页�?*: 每个prompt组合生成独立页面
- **多语言SEO**: 各语言版本独立sitemap
- **结构化数�?*: Schema.org标记 (Product, HowTo, FAQ)
- **性能优化**: 图片lazy loading, WebP格式

## 产品功能决策

### 核心功能模块
1. **智能Prompt生成�?*
   - 可视化参数选择 (类别、风格、灯�?
   - 实时prompt预览
   - 一键发送到AI生成

2. **AI图像生成**
   - 用户上传照片 �?选择风格 �?生成优化prompt �?调用API �?展示结果

3. **社区功能**
   - 作品画廊 (按类别、风格、受欢迎程度排序)
   - 点赞/评论系统
   - 用户关注功能
   - 每周最佳作品推�?
4. **模板市场** (未来功能)
   - 专业摄影师可出售prompt模板
   - 用户可购买高级模�?
### 用户体验决策
- **免登录体�?*: 支持，使用IP限制防滥�?- **渐进式引�?*: 2次免�?�?注册获得更多 �?超限提示升级
- **防滥用机�?*: IP + 设备指纹识别，VPN检�?
## 增长策略决策

### 流量获取
- **SEO优化**: 针对高价值关键词
- **长尾内容**: 大量prompt组合页面
- **多语言版本**: 6个目标市�?- **用户生成内容**: 社区作品形成SEO长尾

### 转化优化
```
SEO流量 �?免费体验5�?�?看到价�?�?用完额度 �?"升级解锁无限使用" �?付费转化
预期转化�? 7-10%
```

### 病毒传播
- **水印传播**: 免费版作品带平台水印
- **社交分享**: 一键分享到社交媒体
- **推荐奖励**: 推荐朋友注册获得免费额度

## 开发优先级

### P0 (必须完成)
- [✅] Next.js 15项目架构
- [✅] 多语言国际化支�?- [ ] Supabase数据库设�?- [ ] AI图像生成API集成 (Gemini via OpenRouter)
- [ ] Google OAuth认证 (NextAuth.js v5)
- [ ] Creem支付集成

### P1 (重要功能)
- [ ] 智能prompt生成器界�?- [ ] Cloudflare R2图片存储配置
- [ ] SEO优化和结构化数据

### P2 (增长功能)
- [ ] 用户社区和作品分�?- [ ] 高级分析和监�?
## 营收目标

### 预期指标 (年度)
```
月流量目�? 100K UV (通过SEO)
注册转化�? 7% (7K注册用户)
付费转化�? 10% (700付费用户)
ARPU: $95.88/�?(考虑年付折扣)
年营收目�? $67K+
```

## 风险控制

### 技术风�?- **API成本控制**: 合理使用限制，异常监�?- **滥用防护**: IP限制，验证码，人工审�?- **数据安全**: 图片24小时后自动删除，GDPR合规

### 业务风险
- **竞品风险**: 差异化定位，专注垂直领域
- **政策风险**: 多地区部署，合规审查
- **技术依�?*: 双重AI API保障 (Gemini + OpenAI)

---
