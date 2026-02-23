// TradingViewWidget.jsx
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    // clear previous content to avoid duplicates (React StrictMode remounts in dev)
    el.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
        {
          "colorTheme": "dark",
          "dateRange": "12M",
          "locale": "en",
          "largeChartUrl": "",
          "isTransparent": false,
          "showFloatingTooltip": false,
          "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
          "plotLineColorFalling": "rgba(41, 98, 255, 1)",
          "gridLineColor": "rgba(240, 243, 250, 0)",
          "scaleFontColor": "#DBDBDB",
          "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
          "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
          "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
          "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
          "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
          "tabs": [
            {
              "title": "Indices",
              "symbols": [
                {
                  "s": "FOREXCOM:SPXUSD",
                  "d": "S&P 500 Index"
                },
                {
                  "s": "FOREXCOM:DJI",
                  "d": "Dow Jones Industrial Average Index"
                },
                {
                  "s": "IG:NASDAQ",
                  "d": "Nasdaq Index",
                  "logoid": "indices/nasdaq-composite",
                  "currency-logoid": "country/US"
                }
              ],
              "originalTitle": "Indices"
            },
            {
              "title": "Top Stocks",
              "symbols": [
                {
                  "s": "NASDAQ:AAPL",
                  "d": "",
                  "logoid": "apple",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:TSLA",
                  "d": "",
                  "logoid": "tesla",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:NVDA",
                  "d": "",
                  "logoid": "nvidia",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:AMZN",
                  "d": "",
                  "logoid": "amazon",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:MSFT",
                  "d": "",
                  "logoid": "microsoft",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:META",
                  "d": "",
                  "logoid": "meta-platforms",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:AMD",
                  "d": "",
                  "logoid": "advanced-micro-devices",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:NFLX",
                  "d": "",
                  "logoid": "netflix",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:GOOGL",
                  "d": "",
                  "logoid": "alphabet",
                  "currency-logoid": "country/US"
                },
                {
                  "s": "NASDAQ:COIN",
                  "d": "",
                  "logoid": "coinbase",
                  "currency-logoid": "country/US"
                }
              ]
            }
          ],
          "support_host": "https://www.tradingview.com",
          "backgroundColor": "#0f0f0f",
          "width": "100%",
          "height": "100%",
          "showSymbolLogo": true,
          "showChart": true
        }`;

    el.appendChild(script);

    // cleanup when component unmounts or before next effect run
    return () => {
      const current = container.current;
      if (current) {
        if (current.contains(script)) current.removeChild(script);
        current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span className="blue-text">Market summary</span></a><span className="trademark"> by TradingView</span></div>
    </div>
  );
}

export default memo(TradingViewWidget);
