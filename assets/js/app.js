const cl = console.log;
const inputform =document.getElementById('inputform')
const Addcomment =document.getElementById('Addcomment')
const Updatecomment =document.getElementById('Updatecomment')
const spinner =document.getElementById('spinner')
const name =document.getElementById('name')
const email =document.getElementById('email')
const body =document.getElementById('body')
const userId =document.getElementById('userId')



let Base_Url = `https://jsonplaceholder.typicode.com`

let CommentArr =[]



function snackbar(msg,icon){
  swal.fire({
    title : msg,
    icon : icon,
    timer : 3000
  })
}

function fetchcomment(){

  spinner.classList.remove('d-none')

  let Post_url = `${Base_Url}/comments`

  let xhr = new XMLHttpRequest()
  xhr.open('GET',Post_url)

  xhr.send(null)

  xhr.onload = function() {
    if(xhr.status >=200 && xhr.status <=299){
      CommentArr = JSON.parse(xhr.response)

      createCards(CommentArr.reverse())
    }
  }


}

fetchcomment()


function createCards(arr){
  let result =``

  arr.forEach(ele =>{
    result+=`<div class="col-md-3 col-sm-6 mb-4" id='${ele.id}'>
                <div class="card h-100">
                  <div class="card-header">
                    <h2>${ele.email}</h2>
                    
                  </div>
                  <div class="card-body">
                    <h3> Name : ${ele.name}</h3>
                    <p> Comment : ${ele.body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-danger btn-sm " onclick="OnEdit(this)">Edit</button>
                    <button class="btn btn-primary btn-sm " onclick="OnRemove(this)">Delete</button>

                  </div>
                </div>
              </div>`
  })

  let cardcontainer = document.getElementById('cardcontainer')

  cardcontainer.innerHTML =result

  spinner.classList.add('d-none')

}


function onsubmit(ele){
  ele.preventDefault()
  spinner.classList.remove('d-none')

  
  let newobj ={
    userId : userId.value,
    name : name.value,
    email : email.value,
    body : body.value

  }

  let Post_url = `${Base_Url}/comments`

  let xhr = new XMLHttpRequest()

  xhr.open('POST',Post_url)

  xhr.send(JSON.stringify(newobj))

  xhr.onload = function(){

    if(xhr.status >=200 && xhr.status <= 299){
      let res = JSON.parse(xhr.response)

      createNewcard(newobj,res)

    }else{
      snackbar(xhr,'error')
    }

    

  }

}

function createNewcard(newobj,res){
  let div = document.createElement('div')
  div.className = 'col-md-4 my-4'
  div.id = res.id


  div.innerHTML =`<div class="card h-100">
                  <div class="card-header">
                    <h2>${newobj.email}</h2>
                    
                  </div>
                  <div class="card-body">
                    <h3> Name : ${newobj.name}</h3>
                    <p> Comment : ${newobj.body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-danger btn-sm " onclick="OnEdit(this)">Edit</button>
                    <button class="btn btn-primary btn-sm " onclick="OnRemove(this)">Delete</button>

                  </div>
                </div>`

  let cardcontainer = document.getElementById('cardcontainer')

  cardcontainer.prepend(div)
  inputform.reset()

  snackbar(`The New Comment id ${res.id} Is Added Successfully!!`,'success')

  spinner.classList.add('d-none')


}


function OnEdit(ele){
  let EditId = ele.closest('.col-md-4').id
  spinner.classList.remove('d-none')

  localStorage.setItem('EditId',EditId)


  let Get_url = `${Base_Url}/comments/${EditId}`

  let xhr = new XMLHttpRequest()

  xhr.open('GET',Get_url)

  xhr.send(null)

  xhr.onload = function (){
    if(xhr.status >=200 && xhr.status <=299){
      let editObj = JSON.parse(xhr.response)

      name.value = editObj.name
      email.value = editObj.email
      body.value = editObj.body
      name.value = editObj.name

      Addcomment.classList.add('d-none')
      Updatecomment.classList.remove('d-none')



    }else{
      snackbar(xhr,'error')
    }

     spinner.classList.add('d-none')


  }


}

function onupdate(){
  spinner.classList.remove('d-none')


  let updateId = localStorage.getItem('EditId')

  let updateObj ={
    userId : userId.value,
    name : name.value,
    email : email.value,
    body : body.value,
    id : updateId
  }


  let PUT_Url = `${Base_Url}/comments/${updateId}`

  let xhr = new XMLHttpRequest()

  xhr.open('PUT',PUT_Url)

  xhr.send(updateObj)

  xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){

      let div = document.getElementById(updateId)
      let h2 = div.querySelector('.card-header h2')

      h2.innerText = updateObj.name

      let h3 = div.querySelector('.card-body h3')

      h3.innerText = updateObj.email

      let p = div.querySelector('.card-body p')

      p.innerText = updateObj.body

      inputform.reset()
      Addcomment.classList.remove('d-none')
      Updatecomment.classList.add('d-none')
      
      snackbar(`The Comment id ${updateId} Is Updated Successfully!!`,'success')

    }else{
      snackbar(xhr,'error')
    }

      spinner.classList.add('d-none')


  }


}


function OnRemove(ele){
  let removeId = ele.closest('.col-md-4').id
  Swal.fire({
  title: `Are you sure you want to delete comment ${removeId}?`,
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
  spinner.classList.remove('d-none')


  let delete_url = `${Base_Url}/comments/${removeId}`

  let xhr = new XMLHttpRequest()

  xhr.open('DELETE',delete_url)

  xhr.send(null)

  xhr.onload = function() {
    if(xhr.status >=200 && xhr.status <= 299){

      ele.closest('.col-md-4').remove()

      snackbar(`The Comment id ${removeId} Is Removed Successfully!!`,'success')


    }else{
      snackbar(xhr,'error')
    }


    spinner.classList.add('d-none')

  }
  }
});

  

}










inputform.addEventListener('submit',onsubmit)
Updatecomment.addEventListener('click',onupdate)