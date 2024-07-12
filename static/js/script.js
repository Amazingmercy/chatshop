let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .navbar');

menu.onclick = () =>{
   menu.classList.toggle('fa-times');
   navbar.classList.toggle('active');
};

window.onscroll = () =>{
   menu.classList.remove('fa-times');
   navbar.classList.remove('active');
};


document.querySelector('#close-edit').onclick = () =>{
   document.querySelector('.edit-form-container').style.display = 'none';
   window.location.href = 'admin.php';
};

//Modified functions
function showEditForm(id, name, price, image) {
   document.getElementById('update_p_id').value = id;
   document.getElementById('update_p_name').value = name;
   document.getElementById('update_p_price').value = price;
   document.getElementById('edit-preview-image').src = '/uploaded_img/' + image;
   document.querySelector('.edit-form-container').style.display = 'flex';
}

function hideEditForm() {
   document.querySelector('.edit-form-container').style.display = 'none';
}