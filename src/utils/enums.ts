enum Route {
	daily = "daily",
	history = "history",
	settings = "settings",
}

enum FinanceLiteral {
	income = "income",
	balance = "balance",
	spending = "spending",
	limit = "limit",
}

enum Mode {
	average = "average",
	cumulative = "cumulative",
	individual = "individual",
}

enum CurrencySymbol {
	euro = "€",
	pound = "£",
	usd = "$",
}

export { Route, FinanceLiteral, Mode, CurrencySymbol };
