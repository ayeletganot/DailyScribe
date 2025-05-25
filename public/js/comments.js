// Handle comment editing functionality
document.addEventListener('DOMContentLoaded', function() {

    const textarea = document.getElementById('addComment');
    const button = document.getElementById('submitComment');
    console.log(textarea)
    textarea.addEventListener('input', () => {
        console.log(textarea.value)
        button.disabled = textarea.value.trim() === '';
    });

}); 