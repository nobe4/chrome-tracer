var urls = { urls: ['<all_urls>'] };

function handleRequests(event, type){
  chrome.webRequest[event].addListener(function(request){
    if(request.tabId > 0) {
      chrome.tabs.sendMessage(request.tabId, {
        'data': request,
        'type': type
      });
    }
  }, urls);
}

handleRequests('onBeforeRequest', 'new');
handleRequests('onCompleted', 'close');
handleRequests('onErrorOccurred', 'fail');
