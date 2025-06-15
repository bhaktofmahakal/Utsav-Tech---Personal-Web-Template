/*
Author URI: http://webthemez.com/
Note: 
Licence under Creative Commons Attribution 3.0 
Do not remove the back-link in this web template 
-------------------------------------------------------*/

$(window).load(function() {
    jQuery('#all').click();
    return false;
});

$(document).ready(function() {
    $('#header_wrapper').scrollToFixed();
    $('.res-nav_click').click(function() {
        $('.main-nav').slideToggle();
        return false

    });
	
    if ($('#main-nav ul li:first-child').hasClass('active')) {
        $('#main-nav').css('background', 'none');
    }
    $('#mainNav').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 950,
        scrollThreshold: 0.2,
        filter: '',
        easing: 'swing',
        begin: function() {
        },
        end: function() {
            if (!$('#main-nav ul li:first-child').hasClass('active')) {
                $('.header').addClass('addBg');
            } else {
                $('.header').removeClass('addBg');
            }

        },
        scrollChange: function($currentListItem) {
            if (!$('#main-nav ul li:first-child').hasClass('active')) {
                $('.header').addClass('addBg');
            } else {
                $('.header').removeClass('addBg');
            }
        }
    });

    var container = $('#portfolio_wrapper');


    container.isotope({
        animationEngine: 'best-available',
        animationOptions: {
            duration: 200,
            queue: false
        },
        layoutMode: 'fitRows'
    });

    $('#filters a').click(function() {
        $('#filters a').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        container.isotope({
            filter: selector
        });
        setProjects();
        return false;
    });

    function splitColumns() {
        var winWidth = $(window).width(),
            columnNumb = 1;


        if (winWidth > 1024) {
            columnNumb = 4;
        } else if (winWidth > 900) {
            columnNumb = 2;
        } else if (winWidth > 479) {
            columnNumb = 2;
        } else if (winWidth < 479) {
            columnNumb = 1;
        }

        return columnNumb;
    }
	
    function setColumns() {
        var winWidth = $(window).width(),
            columnNumb = splitColumns(),
            postWidth = Math.floor(winWidth / columnNumb);

        container.find('.portfolio-item').each(function() {
            $(this).css({
                width: postWidth + 'px'
            });
        });
    }

    function setProjects() {
        setColumns();
        container.isotope('reLayout');
    }

    container.imagesLoaded(function() {
        setColumns();
    });


    $(window).bind('resize', function() {
        setProjects();
    });


});

wow = new WOW({
    animateClass: 'animated',
    offset: 100
});
wow.init();
document.getElementById('').onclick = function() {
    var section = document.createElement('section');
    section.className = 'wow fadeInDown';
    section.className = 'wow shake';
    section.className = 'wow zoomIn';
    section.className = 'wow lightSpeedIn';
    this.parentNode.insertBefore(section, this);
};

// New code for contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const feedbackDiv = document.getElementById('contactFormFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const messageInput = document.getElementById('contactMessage');

            // Basic client-side validation (optional, can be enhanced)
            if (!nameInput.value.trim()) {
                feedbackDiv.innerHTML = '<p style="color: red;">Please enter your name.</p>';
                return;
            }
            if (!emailInput.value.trim()) {
                feedbackDiv.innerHTML = '<p style="color: red;">Please enter your email.</p>';
                return;
            }
            // Basic email format check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value)) {
                feedbackDiv.innerHTML = '<p style="color: red;">Please enter a valid email address.</p>';
                return;
            }
            if (!messageInput.value.trim()) {
                feedbackDiv.innerHTML = '<p style="color: red;">Please enter your message.</p>';
                return;
            }

            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            };

            feedbackDiv.innerHTML = '<p style="color: blue;">Sending...</p>';

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) { // Assuming backend returns { message: "..." } on success
                    feedbackDiv.innerHTML = '<p style="color: green;">' + data.message + '</p>';
                    contactForm.reset(); // Clear the form
                    // The form.reset() method should now correctly clear the fields
                    // and allow their placeholder attributes to be displayed.
                    // No need to manually reset defaultValue for inputs or clear textarea.
                } else if (data.error) { // Assuming backend returns { error: "..." } on failure
                    feedbackDiv.innerHTML = '<p style="color: red;">Error: ' + data.error + '</p>';
                } else {
                    feedbackDiv.innerHTML = '<p style="color: red;">An unexpected error occurred.</p>';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                feedbackDiv.innerHTML = '<p style="color: red;">An error occurred while sending your message. Please try again later.</p>';
            });
        });
    }
});