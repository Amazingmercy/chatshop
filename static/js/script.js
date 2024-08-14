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

function showEditForm(productId, name, price, image) {
    document.getElementById(`edit-form-container-${productId}`).style.display = 'flex';
    document.getElementById(`update_p_id-${productId}`).value = productId;
    document.getElementById(`update_p_name-${productId}`).value = name;
    document.getElementById(`update_p_price-${productId}`).value = price;
    document.getElementById(`edit-preview-image-${productId}`).src = `/uploaded_img/${image}`;
}

function hideEditForm(productId) {
    document.getElementById(`edit-form-container-${productId}`).style.display = 'none';
    window.location.href = '/product';
}

function showDeleteForm(productId) {
    document.getElementById(`delete-form-container-${productId}`).style.display = 'flex';
}

function hideDeleteForm(productId) {
    document.getElementById(`delete-form-container-${productId}`).style.display = 'none';
    window.location.href = '/product';
}
