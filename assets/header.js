const onScrollHeader = () => {
    const innerWidth = window.innerWidth;
    const element = window.document.querySelector('.header__heading-link div');
    if(element){
        if (window.scrollY > 0 && innerWidth > 479) {
            element.style.width = '20.8rem';
        }else{
            if(innerWidth > 768) {
                element.style.width = '25.6rem';
            } else if(innerWidth <= 768 && innerWidth > 479){
                element.style.width = '24.6rem';
            }else {
                element.style.width = '19.2rem';
            }
        }
        element.style.transition = 'width 0.2s';
    }
}

window.document.addEventListener('scroll', onScrollHeader);
window.addEventListener('resize', onScrollHeader);
window.addEventListener('load', onScrollHeader);