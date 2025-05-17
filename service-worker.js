chrome.runtime.onInstalled.addListener(() => {
    console.log('Color Grabber installed');
});

chrome.runtime.onStartup.addListener(() => {
    console.log('Color Grabber started');
    
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.contextMenus.onClicked.addListener((data, tab) => {
  // Store the last word in chrome.storage.session.
  chrome.storage.session.set({ lastWord: data.selectionText });

  // Make sure the side panel is open.
  chrome.sidePanel.open({ tabId: tab.id });
});