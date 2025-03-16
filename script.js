async function analyzeStock(symbol) {
    const apiKey = "3FGVUCOO3CW76ZXZ";

    const smaURL = `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=50&series_type=close&apikey=${apiKey}`;
    const rsiURL = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`;
    const macdURL = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${apiKey}`;

    try {
        const smaResponse = await fetch(smaURL);
        const smaData = await smaResponse.json();

        const rsiResponse = await fetch(rsiURL);
        const rsiData = await rsiResponse.json();

        const macdResponse = await fetch(macdURL);
        const macdData = await macdResponse.json();

        let signal = "HOLD"; // Default signal

        if (smaData["Technical Analysis: SMA"] && rsiData["Technical Analysis: RSI"] && macdData["Technical Analysis: MACD"]) {
            const latestRSI = Object.values(rsiData["Technical Analysis: RSI"])[0]["RSI"];
            const latestMACD = Object.values(macdData["Technical Analysis: MACD"])[0]["MACD"];
            const latestMACDSignal = Object.values(macdData["Technical Analysis: MACD"])[0]["MACD_Signal"];

            if (latestRSI < 30 && latestMACD > latestMACDSignal) {
                signal = "BUY";
            } else if (latestRSI > 70 && latestMACD < latestMACDSignal) {
                signal = "SELL";
            }
        }

        document.getElementById("result").innerHTML = `<h2>Stock: ${symbol}</h2><h3>Recommendation: ${signal}</h3>`;
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("result").innerHTML = "Error fetching stock analysis.";
    }
}

document.getElementById("analyzeButton").addEventListener("click", function () {
    const symbol = document.getElementById("stockSymbol").value.toUpperCase();
    analyzeStock(symbol);
});
