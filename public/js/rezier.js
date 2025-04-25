
    const resizer = document.getElementById("resizer");
    const rightSidebar = document.querySelector(".right-sidebar");

    let isResizing = false;

    resizer.addEventListener("mousedown", function (e) {
        isResizing = true;
        document.body.style.cursor = 'ew-resize';
    });

    document.addEventListener("mousemove", function (e) {
        if (!isResizing) return;

        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 300 && newWidth < 450) {
            rightSidebar.style.width = `${newWidth}px`;
        }
    });

    document.addEventListener("mouseup", function () {
        isResizing = false;
        document.body.style.cursor = 'default';
    });

