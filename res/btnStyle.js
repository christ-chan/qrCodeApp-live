const button = document.querySelector('.button')
const submit = document.querySelector('.submit')
const buttonSub = document.getElementById('loadButton')
const formEle = document.getElementById('formScan')
const buttonRefreshSuccess = document.getElementById('refreshSuccess')
const buttonRefreshError = document.getElementById('refreshError')
const formScan = document.getElementById('qrCode').value
const buttonSwitch = document.getElementById('switch')

document.getElementById('success-box').style.visibility = 'hidden'
document.getElementById('error-box').style.visibility = 'hidden'
const boxAim = document.querySelector('.box-corner').style.visibility = 'hidden'

function stopCam () {
  scanner.stop()
  console.log('stopped camera')
}
//CameraPermission
const CamPermission = () => {
  return !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
  )
}


function showButton () {
  document.getElementById('loadButton').style.visibility = 'visible'
}

const checkStatus = async () => {
  // checkStatus of a server
  try {
    const online = await fetch('http://192.168.1.45:5001/') //online
    return online.status >= 200 && online.status < 300
  } catch (error) {
    return false //back false if status offline
  }
}
setInterval(async () => {
  const result = await checkStatus()
  const displayStatus = document.querySelector('.status')
  displayStatus.textContent = result ? 'Online' : 'Server Offline'
  if (result === true) {
    displayStatus.style.color = '#07fc07'
  } else if (result !== true) {
    displayStatus.style.color = '#ee161fcc'
  }
}, 5000)

function showNotify () {
  let formVal = document.getElementById('qrCode').value
  let success = document.getElementById('success-box')
  let error = document.getElementById('error-box')
  console.log(formVal)

  setInterval(async () => {
    const result = await checkStatus()
    if (
      (result === true && 
      formVal === 'MH,1,PREMIUM') ||
      formVal === 'MH,1,UNLEADED' ||
      formVal === 'MH,1,DIESEL'
    ) {
      success.style.visibility = 'visible'
      console.log('On')
    } else {
      error.style.visibility = 'visible'
      console.log('Off')
    }
  }, 100)
  stopCam()
}

function closeButton () {
  document.getElementById('loadButton').style.visibility = 'hidden'
}

function toggleClass () {
  this.classList.toggle('active')
}

function addClass () {
  this.classList.add('finished')
  stopCam()
  disableButton()
  /*Message*/ showNotify()
}

function disableButton () {
  document.querySelector('.button').disabled = true
}

function refreshPage () {
  var ele = document.getElementById('formScan')
  ele.addEventListener('reset', function () {
    console.log('reset form')
  })
  window.location.reload()
}

///to switch camera
let clickCount = 0
function switchCam () {
  let camCurrent = 0
  clickCount++

  //CAMERA 1ST
  function cam1 () {
    Instascan.Camera.getCameras()
      .then(cameras => {
        try {
          if (cameras.length > 0) {
            scanner.start(cameras[0])
          } else {
            alert('No camera. Please allow camera access.')
          }
        } catch (error) {
          console.log(error)
        }
      })
      .catch(function (e) {
        console.log(e)
      })
  }
  //CAMERA 2ND
  function switchCamNext () {
    Instascan.Camera.getCameras()
      .then(cameras => {
        if (cameras.length > 0) {
          camCurrent = (camCurrent + 1) % cameras.length
          scanner.start(cameras[camCurrent])
          console.log('camera 2 started')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  if (clickCount % 2 == 0) {
    switchCamNext()
    console.log('second click runing and else')
  } else {
    cam1()
    console.log('cam1 running')
  }
  boxAim.style.visibility = 'visible';
}

const back2Root = () => {
  let ip = 'https://github.com/christ-chan/qrCodeApp-live' //live link
  window.location.replace(`${ip}`)
}

buttonRefreshSuccess.addEventListener('click', refreshPage)
buttonRefreshError.addEventListener('click', back2Root)
button.addEventListener('click', toggleClass)
button.addEventListener('transitionend', toggleClass)
buttonSwitch.addEventListener('click', switchCam)

formEle.addEventListener('click', function (e) {
  let ServerIP = 'http://192.168.1.45:5001'
  e.preventDefault()
  const payload = new FormData(formEle)
  let data = [...payload]

  fetch(`${ServerIP}/ScannerQRCodeApp/`, {
    method: 'POST',
    body: new URLSearchParams(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  })
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      console.log('logsData: ', data)
    })
    .catch(err => console.log('Error', err))
})
button.addEventListener('transitionend', addClass)
