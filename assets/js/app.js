const cl = console.log;

// API configuration 
const BASE_URL = 'https://jsonplaceholder.typicode.com';
const COMMENT_URL = `${BASE_URL}/comments`; 

// DOM Elements Selection
const spinner = document.getElementById('spinner');
const commentForm = document.getElementById('commentForm');
const nameControl = document.getElementById('commentName');
const emailControl = document.getElementById('commentEmail');
const bodyControl = document.getElementById('commentBody');
const addCommentBtn = document.getElementById('addCommentBtn');
const updateCommentBtn = document.getElementById('updateCommentBtn');
const commentContainer = document.getElementById('commentContainer');

let commentsArr = [];
let updateCommentId = null;

// Snackbar / SweetAlert Popup Alert Function
function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000,
        showConfirmButton: false
    });
}

// 1. READ

function fetchComments() {
    spinner.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', COMMENT_URL);
    xhr.send(null);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            commentsArr = [...data];
            // Khup motha data (500 comments) aslyamule pahile 20 items list madhye reverse karun UI la dakhvto.
            createCommentCards(data.slice(0, 20).reverse()); 
            spinner.classList.add('d-none');
        } else {
            spinner.classList.add('d-none');
            snackbar('Something went wrong while fetching data!', 'error');
        }
    };
}

fetchComments();

// Function to generate Dynamic Cards HTML
function createCommentCards(arr) {
    let result = '';
    arr.forEach(comment => {
        result += `
            <div class="col-md-4 mb-4" id="${comment.id}">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-dark text-white">
                        <h5 class="card-title text-truncate mb-1">${comment.name}</h5>
                        <small class="text-info">${comment.email}</small>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${comment.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between bg-white">
                        <button onclick="onEditComment(this)" class="btn btn-sm btn-outline-info">Edit</button>
                        <button onclick="onRemoveComment(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    commentContainer.innerHTML = result;
}


// 2. CREATE 

function onCommentSubmit(eve) {
    eve.preventDefault();
    
    let COMMENT_OBJ = {
        name: nameControl.value,
        email: emailControl.value,
        body: bodyControl.value
    };

    spinner.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('POST', COMMENT_URL);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(COMMENT_OBJ));

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            
            
            res.name = COMMENT_OBJ.name;
            res.email = COMMENT_OBJ.email;
            res.body = COMMENT_OBJ.body;

            
            let col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.id = res.id;
            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-dark text-white">
                        <h5 class="card-title text-truncate mb-1">${res.name}</h5>
                        <small class="text-info">${res.email}</small>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${res.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between bg-white">
                        <button onclick="onEditComment(this)" class="btn btn-sm btn-outline-info">Edit</button>
                        <button onclick="onRemoveComment(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                </div>
            `;
            commentContainer.prepend(col);
            commentForm.reset();
            spinner.classList.add('d-none');
            snackbar(`New comment with id ${res.id} created successfully!`, 'success');
        } else {
            spinner.classList.add('d-none');
            snackbar('Failed to add comment!', 'error');
        }
    };
}
if(commentForm) {
    commentForm.addEventListener('submit', onCommentSubmit);
}


// 3. UPDATE 

function onEditComment(ele) {
    updateCommentId = ele.closest('.col-md-4').id;
    let EDIT_URL = `${COMMENT_URL}/${updateCommentId}`;

    spinner.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', EDIT_URL);
    xhr.send(null);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            nameControl.value = res.name;
            emailControl.value = res.email;
            bodyControl.value = res.body;

            addCommentBtn.classList.add('d-none');
            updateCommentBtn.classList.remove('d-none');
            spinner.classList.add('d-none');
            
            // Window var scroll up karne jevha user edit click karel
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };
}


// 3. UPDATE 

function onUpdateCommentSubmit() {
    let UPDATE_OBJ = {
        name: nameControl.value,
        email: emailControl.value,
        body: bodyControl.value
    };

    spinner.classList.remove('d-none');
    let UPDATE_URL = `${COMMENT_URL}/${updateCommentId}`;

    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', UPDATE_URL);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(UPDATE_OBJ));

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            
            let card = document.getElementById(updateCommentId);
            if(card) {
                card.querySelector('.card-title').innerHTML = UPDATE_OBJ.name;
                card.querySelector('.text-info').innerHTML = UPDATE_OBJ.email;
                card.querySelector('.card-text').innerHTML = UPDATE_OBJ.body;
            }
            
            commentForm.reset();
            addCommentBtn.classList.remove('d-none');
            updateCommentBtn.classList.add('d-none');
            spinner.classList.add('d-none');
            snackbar('Comment updated successfully!', 'success');
        } else {
            spinner.classList.add('d-none');
            snackbar('Failed to update comment!', 'error');
        }
    };
}
if(updateCommentBtn) {
    updateCommentBtn.addEventListener('click', onUpdateCommentSubmit);
}


// 4. DELETE (Remove with SweetAlert2 Confirmation Popup)

function onRemoveComment(ele) {
    
    let removeId = ele.closest('.col-md-4').id;
    let DELETE_URL = `${COMMENT_URL}/${removeId}`;

    
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this comment!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',    
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        
        if (result.isConfirmed) {
            
        
            spinner.classList.remove('d-none');
            
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', DELETE_URL);
            xhr.send(null);

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    
                    let cardHTML = document.getElementById(removeId);
                    if(cardHTML) {
                        cardHTML.remove();
                    }
                    
                    
                    spinner.classList.add('d-none');
                    
                    
                    Swal.fire(
                        'Deleted!',
                        'Your comment has been deleted successfully.',
                        'success'
                    );
                } else {
                    spinner.classList.add('d-none');
                    Swal.fire('Error!', 'Failed to delete comment from server.', 'error');
                }
            };
            
            xhr.onerror = function() {
                spinner.classList.add('d-none');
                Swal.fire('Error!', 'Network issue while deleting.', 'error');
            };
        }
    });
}