# 📅 Angular Material Date Time Range Picker

一个可定制的**日期范围选择器**，使用**Angular 20**、**Angular Material**和**Tailwind CSS v4**构建，支持**双向绑定**、**日期时间偏移**以及干净的深色/浅色现代UI。


---

## ✨ 特性

- ✅ 使用**Angular v20**构建
- 🎨 使用**Tailwind CSS v4**样式
- 🧱 使用最新的**Angular Material**组件
- 🕑 支持**日期和时间选择**
- 🔄 使用Signal进行开始和结束日期时间的**双向绑定**
- 🧭 处理**偏移**和时区调整
- 📦 轻量级、响应式且易于集成

---

## ⚠️ 注意

本项目基于 [https://github.com/omidkh68/material-tailwind-range-date-picker](https://github.com/omidkh68/material-tailwind-range-date-picker) 二次开发，做了大量修改，适用于特定项目，不建议公众使用。建议使用原版！

---

## 🚀 开始使用

### 克隆仓库
```bash
git clone https://github.com/xylplm/angular-material-date-time-range-picker.git
cd angular-material-date-time-range-picker
```

### 安装依赖
```bash
npm install
```

### 本地运行应用
```bash
ng serve
```

然后访问 [http://localhost:4200](http://localhost:4200)

---

## 🛠 使用的技术

| 工具             | 版本 |
|------------------|---------|
| Angular          | ^21     |
| Angular Material | ^21     |
| Tailwind CSS     | ^4      |
| Ng-icon          | ^31     |
| TypeScript       | ^5      |

---

## 📚 如何使用

### 1. 在模板中添加 `DatePicker`
```html
<date-picker [(dateTimePicker)]="dateTimePicker"
             [required]="true"
             (selectedDates)="selectDates($event)"
```

### 2. 在组件中绑定变量
```ts
selectedDateRange = model<DateRange<Date> | undefined>();
```

### 3. 偏移支持
所有日期时间内部使用偏移逻辑进行标准化（例如，UTC+X），使其适用于具有时区感知数据的系统。

---

---

## 📄 许可证

MIT License © 2025 xylplm

---

## 🙌 贡献

欢迎提交拉取请求。对于重大更改，请先打开问题讨论您想要更改的内容。
