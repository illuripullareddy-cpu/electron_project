const { app, desktopCapturer } = require("electron");
const fs = require("fs");
const path = require("path");

async function captureScreenshot(index) {
  try {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });

    if (sources.length === 0) {
      console.log("⚠️ No screen sources found.");
      return;
    }

    const screenshot = sources[0].thumbnail.toPNG();

    const filePath = path.join(__dirname, `screenshot${index}.png`);
    fs.writeFileSync(filePath, screenshot);

    console.log(`✅ Screenshot ${index} saved at: ${filePath}`);
  } catch (err) {
    console.error("❌ Error capturing screenshot:", err);
  }
}

app.whenReady().then(async () => {
  for (let i = 1; i <= 5; i++) {
    await captureScreenshot(i);
  }
  app.quit(); // Exit after saving 5 screenshots
});
