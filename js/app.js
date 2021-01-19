
// {
//   "id": 39,
//   "phone": "+63 (833) 806-2395",
//   "name": "Willi Potkin",
//   "message": "Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.",
//   "avatar": "https://robohash.org/nisicommodidolorem.bmp?size=50x50&set=set1",
//   "date": "1607445416000",
//   "seen": false
// },
let messages = []
getData()
async function getData() {
  const response = await fetch('./data/senders.json')
  let data = await response.json();
  messages = data
  renderMessageList(data, messageField)
}


if (!localStorage.viewedMessageList) {
  localStorage.viewedMessageList = JSON.stringify([])
}
if (!localStorage.deletedMessageList) {
  localStorage.deletedMessageList = JSON.stringify([])
}

const messageField = document.getElementById('messageField')
const allMessageCount = document.getElementById('allMessageCount')
const reload = document.getElementById('reload')
const unreadMessageCount = document.getElementById('unreadMessageCount')
const searchForm = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit'
})
const dateFormatter = new Intl.DateTimeFormat(undefined, {
})

function seenCheck(data) {
  const viewedMessageList = JSON.parse(localStorage.viewedMessageList)
  const deletedMessageList = JSON.parse(localStorage.deletedMessageList)
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    if (element.seen == true && !viewedMessageList.includes(element.id)) {
      viewedMessageList.push(element.id)
    }
    if (viewedMessageList.includes(element.id)) {
      element.seen = true
    }
  }
  localStorage.viewedMessageList = JSON.stringify(viewedMessageList)
}


messageField.addEventListener('click', event => {
  const btn = event.target.closest('.message')
  const deletedMessageList = JSON.parse(localStorage.deletedMessageList)
  if (btn == null) {
    return
  }
  console.log(btn);
  const id = btn.dataset.id

  messages.find((element, i, arr) => {
    if (element.id == id) {
      if (element.seen) {
        arr.splice(i, 1)
        deletedMessageList.push(element.id)
      } else {
        element.seen = true
        arr[i] = element
      }
      // btn.classList.remove('unseen')
      // btn.classList.add('seen')
      renderMessageList(arr, messageField)
      return true
    }
  })
  localStorage.deletedMessageList = JSON.stringify(deletedMessageList)
})

searchForm.addEventListener('submit', ev => {
  ev.preventDefault()
  let val = ev.target.searchInput.value.trim().toLowerCase()
  message = messages.filter(messages => {
    let searchTarget = `${messages.name}${messages.message}${messages.phone}`.trim().toLowerCase()
    return searchTarget.includes(val)
  })
  renderMessageList(message, messageField)
})

reload.addEventListener('click', event => {
  event.target.classList.add('running')
  setTimeout(() => {
    event.target.classList.remove('running')
  }, 1000);

  getData()
})


function renderMessageList(data, node) {
  node.innerHTML = ''
  // const deletedMessageList = JSON.parse(localStorage.deletedMessageList)
  seenCheck(data)

  allMessageCount.textContent = data.length
  unreadMessageCount.textContent = data.filter(elem => !elem.seen).length

  data.sort((a, b) => {
    return a.seen - b.seen || b.date - a.date
  })
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i]
      // if (deletedMessageList.includes(element.id)) {
      //   return 
      // }
      let html = createHTML(element)
      node.insertAdjacentHTML('beforeend', html)
    }
  } else {
    node.insertAdjacentHTML('beforeend', '<h6 class="text-center my-5">Элементов нет :(</h6>')
  }
}

function createHTML(user) {

  return `<div class="message ${user.seen ? 'seen' : 'unseen'}" data-id="${user.id}">
  <div class="message-sender col-3">
    <img width="50" height="50" loading="lazy" src="${user.avatar}" alt="${user.name}">
    <div class="message-sender-contact">
      <p>${user.name}</p>
      <p>${user.phone}</p>
    </div>
  </div>
  <div class="message-text col-6">
    ${user.message}
  </div>
  <div class="timeDate col-3 row">
    <p>${timeFormatter.format(user.date)}</p>
    <p>${dateFormatter.format(user.date)}</p>
  </div>
</div> `
}







































// if (!localStorage.seenMessageList) {
//   localStorage.seenMessageList = JSON.stringify([])
// }
// const body = document.getElementById('body')
// const header = document.getElementById('header')
// const seenMessageCount = document.getElementById('seenMessageCount')
// const unseenMessageCount = document.getElementById('unseenMessageCount')
// const messageField = document.getElementById('messageField')
// const seenMessage = []
// let unseenMessage = messages.length - seenMessage.length

// // function unseenCount(messages, seen) {
// //   unseenMessage = 0
// //   unseenMessage += messages.length - seen.length
// // }
// messageField.insertAdjacentHTML('afterbegin', createMessage(messages))
// seenMessageCount.insertAdjacentHTML('beforeend', `сообщений - ${messages.length}`)
// unseenMessageCount.insertAdjacentHTML('beforeend', `непрочитанных - ${unseenMessage}`)

// renderMessageList(messages, messageField)


// body.addEventListener('click', event => {
//   if(event.target.classList.contains('reload')){
//     event.target.style.transform += `rotate(360deg)`
//     location.reload()
//   }
// })

// messageField.addEventListener('click', event => {
//   const btn = event.target
//   const id = btn.dataset.id
//   const seenMessageList = JSON.parse(localStorage.seenMessageList)
//   if ( btn.closest('.message')) {
//     seenMessageList.push(id)
//     btn.classList.remove('unseen')
//     btn.classList.add('seen')
//     renderSeenMessage(btn)
//     --unseenMessage
//   }
//   if (!seenMessageList.includes(id)) {
//     unseenMessageCount.innerHTML = ""
//     unseenMessageCount.insertAdjacentHTML('beforeend', `непрочитанных - ${unseenMessage}`)
//     console.log(unseenMessage);
//   }
//   localStorage.seenMessageList = JSON.stringify(seenMessageList)
// })

// function renderSeenMessage (node){
//   if (node.classList.contains('seen')) {
//     seenMessage.push(node.id)
//   }
// }

// // function sortData(a, b){
// //   return (a.time - b.time)
// // }
// // messages.sort(sortData(a, b))




// function renderMessageList(data, node) {
//   node.innerHTML = ''
//   if (data && data.length > 0) {
//     for (let i = 0; i < data.length; i++) {
//       if (node.classList.contains('seen')) {
//         seenMessage.push(node)
//       }
//       const element = data[i]
//       let html = createMessage(element)
//       node.insertAdjacentHTML('beforeend', html)
//     }
//   } else {
//     node.insertAdjacentHTML('beforeend', '<h6 class="text-center my-5">Элементов нет :(</h6>')
//   }
// }
// function createMessage(user) {
//   let person = `${user.first_name} ${user.last_name}`
//   return `<div class="message unseen" data-id="${user.id}">
//   <div class="message-sender col-3">
//     <img src="img/1.jpg" alt="1">
//     <div class="message-sender-contact">
//       <p>${person}</p>
//       <p>${user.tel}</p>
//     </div>
//   </div>
//   <div class="message-text col-6">
//     Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
//     Harum officia repudiandae voluptates, dolores temporibus
//     ex iusto, incidunt recusandae aliquid totam veritatis
//   </div>
//   <div class="timeDate col-3 row">
//     <div class="time">${user.time}</div>
//     <div class="date">${user.Datetime}</div>
//   </div>
// </div>`
// }