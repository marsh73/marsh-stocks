const styles = {
  currency: 'currency',
  int: 'int'
};

export const tickerDataMap = (data) => {
  const mapped = {};

  if (data.GetDailyOpenClose) {
    mapped.daily = {
      open: {label: "Open", value: data.GetDailyOpenClose?.open, style: styles.currency},
      close: {label: "Close", value: data.GetDailyOpenClose?.close, style: styles.currency},
      volume: {label: "Volume", value: data.GetDailyOpenClose?.volume, style: styles.int},
      high: {label: "High", value: data.GetDailyOpenClose?.high, style: styles.int},
      low: {label: "Low", value: data.GetDailyOpenClose?.low, style: styles.int}
    }
  }

  if (data.GetTicker) {
    mapped.details = {
      market_cap: {label: "Market Cap", value: data.GetTicker?.market_cap, style: styles.currency},
      employees: {label: "Employees", value: data.GetTicker?.total_employees, style: styles.int},
      shares_outstanding: {label: "Shares Outstanding", value: data.GetTicker?.share_class_shares_outstanding, style: styles.int}
    }
  }

  if (data.GetFinancials) {
    mapped.financial = {
      revenue: {label: "Revenue", value: data.GetFinancials?.revenue, style: styles.currency},
      operating_expenses: {label: "Opex", value: data.GetFinancials?.operating_expenses, style: styles.currency},
      gross_profit: {label: "Gross Profit", value: data.GetFinancials?.gross_profit, style: styles.currency},
      basic_eps: {label: "Basic EPS", value: data.GetFinancials?.basic_eps, style: styles.currency}
    }
  }

  mapped.news = data.GetNews;

  return mapped;
}