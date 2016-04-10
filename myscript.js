(function(){
  // ### Generic dom manipulation ###
  // look ma ! no jquery !
  var $ = function(a){return document.querySelector(a);};
  var $all = function(a){return document.querySelectorAll(a);};

  // Create a new dom element, with id classname and insert it in his parent
  var $new = function(a, id, className, parent){
    var t = document.createElement(a);
    t.id = id;
    t.className = className;
    if (parent) parent.appendChild(t);
    return t;
  };

  function $class(id, className){
    try{
      $('#' + id).className = className;
    } catch (e) { }
  }

  // ### Global values ###
  // Unicode arrows
  var upArrow = '▲';
  var downArrow = '▼';

  var autoScrollArrow = '⥥';
  var noAutoScrollArrow = '⥮';
  var autoScroll = true;

  // Create container
  var container = $new('div', 'google-tracer-container', '', $('body'));

  // Create container menu
  var containerMenu = $new('div', 'container-menu', '', container);

  // Create container request list
  var containerList = $new('div', 'container-list', '', container);

  // Create the collapse switch button
  var collapseButton = $new('a', 'container-collapse', '', containerMenu);
  collapseButton.innerText = downArrow;

  // On click, collapse
  collapseButton.addEventListener('click', function(){

    if(container.className == 'collapsed'){
      container.className = '';
      collapseButton.innerText = downArrow;
    } else {
      container.className = 'collapsed';
      collapseButton.innerText = upArrow;
    }

  });

  // Create the autoScroll switch button
  var autoScrollButton = $new('a', 'container-collapse', '', containerMenu);
  autoScrollButton.innerText = noAutoScrollArrow;

  // On click, autoScroll
  autoScrollButton.addEventListener('click', function(){

    if(autoScroll){
      autoScrollButton.innerText = autoScrollArrow;
    } else {
      autoScrollButton.innerText = noAutoScrollArrow;
    }

    autoScroll = !autoScroll;
  });

  function createNewRequestContainer(id){
    var request = $new('div', 'request-' + id, '', containerList);
    request.className = 'request';
    request.innerHTML = id;

    if(autoScroll) {
      containerList.scrollTop = containerList.scrollHeight;
    }

    request.addEventListener('click', function(e){
      var requests = $all('.request');

      for(var i = requests.length; i --> 0;){
        requests[i].className = requests[i].className.replace('active','');
      }

      request.className += ' active';
    });

    return request;
  }

  function createNewRequestInfo(request, data){
    var requestInfo = $new('div', '', 'request-info', request);

    // Display a usefull url shorter than the original
    var dislayUrl = data.url
      .replace(/^https?:\/\/(www\.)?/,'')
      .substring(0,30)

    requestInfo.innerHTML = '<a title="' + data.url + '" href="' + data.url + '">' + dislayUrl + '</a>';
    return requestInfo;
  }

  // Create the new request element
  function newRequest(data){
    var request = createNewRequestContainer(data.requestId);
    createNewRequestInfo(request, data);
  }

  // Updating a state means only changing a class (for display purpose)
  function closeRequest(data){
    $class('request-' + data.requestId, 'request request-close');
  }

  function failRequest(data){
    $class('request-' + data.requestId, 'request request-fail');
  }

  // Link the handlers
  var handleRequest = {
    'new': newRequest,
    'close': closeRequest,
    'fail': failRequest
  };

  // Entry point of the script
  // the new requests will be handled depending of the type, creating/updating request's dom elements
  chrome.runtime.onMessage.addListener(function(request) {
    handleRequest[request.type](request.data);
  });
})()
