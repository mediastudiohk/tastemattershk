

const onScrollHeader = () => {
    const element = window.document.querySelector('.header__heading-link div');
    if(element){
        if (window.scrollY > 0) {
            element.style.width = '20.8rem';
        }else{
            element.style.width = '25.6rem';
        }
    }
}


window.document.addEventListener('scroll', onScrollHeader);