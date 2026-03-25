# CauseMatch Campaign Tracker

מעקב בזמן אמת אחר קמפיין CauseMatch של ישיבת תפארת התורה.

## מה זה עושה?
- שואב נתונים מה-API הציבורי של CauseMatch כל 3 שניות
- מציג סכום תרומות ב-₪, $, £
- מספר תורמים, יחס מצ'ינג, סרגל התקדמות
- טיימר ספירה לאחור לסיום הקמפיין
- יומן שינויים בזמן אמת

## הפעלה

נדרש [Node.js](https://nodejs.org/) מותקן.

```bash
node tracker-server.js
```

פתח בדפדפן: **http://localhost:3355**

## מבנה
- `tracker-server.js` - שרת Node.js שמשמש כפרוקסי ל-API (פותר CORS)
- `causematch-tracker.html` - דף המעקב עם ממשק גרפי

## API
הנתונים נשאבים מ: `https://causematch.com/api/public/campaign/yth`
