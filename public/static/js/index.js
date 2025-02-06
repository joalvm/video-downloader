(() => {
    const urlInput = document.getElementById('urlInput');
    const pasteBtn = document.getElementById('pasteBtn');
    const searchBtn = document.getElementById('searchBtn');
    const videoInfo = document.getElementById('videoInfo');

    function humanDuration(duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);

        return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${seconds}s`;
    }

    function errorAlert(message) {
        const alert = document.createElement('div');
        const icon = lucide.createElement(lucide.AlertCircle);
        const text = document.createElement('p');

        alert.classList.add('flex', 'items-center', 'bg-red-100', 'border', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'relative', 'mb-4');
        icon.setAttribute('class', 'h-5 w-5 mr-2');
        text.textContent = message;

        alert.appendChild(icon);
        alert.appendChild(text);

        return alert;
    }

    async function handleDownload() {
        const downloadBtn = this;
        const url = downloadBtn.dataset.url;
        const format = downloadBtn.dataset.format;

        const icon = lucide.createElement(lucide.LoaderCircle);

        icon.setAttribute('class', 'animate-spin h-5 w-5');

        downloadBtn.innerHTML = ``;
        downloadBtn.prepend(icon);
        downloadBtn.disabled = true;

        try {
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({url, format}),
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = downloadUrl;
                a.download = response.headers
                    .get('Content-Disposition')
                    .split('filename=')[1]
                    .replace(/"/g, '')
                    .replace(/\\/g, '');
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(downloadUrl);
            } else {
                alert('Error al descargar el video');
            }
        } catch (error) {
            console.error('Error downloading video:', error);
            alert('Error al descargar el video');
        } finally {
            const downloadIcon = lucide.createElement(lucide.Download);

            downloadIcon.setAttribute('class', 'h-5 w-5 mr-2');

            downloadBtn.innerHTML = ``;
            downloadBtn.disabled = false;

            if (downloadBtn.dataset.format === 'audio') {
                downloadBtn.prepend(lucide.createElement(lucide.Music));
            } else {
                downloadBtn.prepend(lucide.createElement(lucide.Video));
            }
        }
    }

    function makeButton(title, url, format, icon) {
        /** @type {HTMLButtonElement} */
        const button = document.createElement('button');
        const buttonIcon = lucide.createElement(icon);

        buttonIcon.setAttribute('class', 'h-5 w-5');

        button.classList.add(
            'w-full',
            'inline-flex',
            'items-center',
            'justify-center',
            'gap-2',
            'whitespace-nowrap',
            'rounded-md',
            'text-sm',
            'font-medium',
            'transition-colors',
            'focus-visible:outline-none',
            'focus-visible:ring-1',
            'focus-visible:ring-ring',
            'disabled:pointer-events-none',
            'disabled:opacity-50',
            '[&_svg]:pointer-events-none',
            '[&_svg]:size-4',
            '[&_svg]:shrink-0',
            'border',
            'border-input',
            'bg-background',
            'shadow-sm',
            'hover:bg-accent',
            'hover:text-accent-foreground',
            'h-10',
            'rounded-md',
            'px-8'
        );
        button.title = title;
        button.dataset.url = url;
        button.dataset.format = format;
        button.prepend(buttonIcon);
        button.addEventListener('click', handleDownload);

        return button;
    }

    function makeButtons(data) {
        const container = document.createElement('div');
        const audioButton = makeButton('Descargar solo audio', data.original_url || data.url, 'audio', lucide.Music);
        const videoAudioButton = makeButton('Descargar video con audio', data.original_url || data.url, 'video_audio', lucide.Video);

        container.classList.add('flex', 'gap-2', 'my-2', 'justify-center');

        container.append(audioButton, videoAudioButton);

        return container;
    }


    function makeVideoInfo(data) {
        const container = document.createElement('div');
        const containerThumbnail = document.createElement('div');
        const thumbnail = document.createElement('img');
        const containerInfo = document.createElement('div');
        const containerinfoInner = document.createElement('div');
        const title = document.createElement('h2');
        const duration = document.createElement('p');
        const description = document.createElement('p');

        container.classList.add('flex', 'flex-col', 'md:flex-row', 'gap-4', 'my-2', 'p-4', 'bg-white', 'rounded-md', 'shadow-md');

        containerThumbnail.classList.add(
            'md:w-2/6',
            'flex',
            'justify-center',
            'items-center',
            'aspect-video',
            'bg-black',
            'rounded-md',
            'shadow-md',
            'h-48',
        );

        thumbnail.classList.add('max-h-48');
        thumbnail.src = `/proxy?url=${encodeURIComponent(data.thumbnail)}`;
        thumbnail.alt = data.title;

        containerInfo.classList.add('md:w-4/6', 'flex', 'flex-col', 'justify-between');

        title.classList.add('text-md', 'font-bold', 'mb-2', 'text-gray-800', 'line-clamp-2');
        title.textContent = data.title;

        duration.classList.add('text-sm', 'text-gray-600', 'mb-2');
        duration.textContent = `Duración: ${humanDuration(data.duration)}`;

        description.classList.add('text-sm', 'text-gray-600', 'mb-2', 'line-clamp-3');
        description.textContent = data.description || 'Sin descripción';

        containerinfoInner.appendChild(title);
        containerinfoInner.appendChild(duration);
        containerinfoInner.appendChild(description);

        containerInfo.appendChild(containerinfoInner);
        containerInfo.append(makeButtons(data));

        containerThumbnail.appendChild(thumbnail);

        container.appendChild(containerThumbnail);
        container.appendChild(containerInfo);

        return container;
    }

    async function handlePasteBtnClick() {
        try {
            const text = await navigator.clipboard.readText();

            // Verificar que sea una URL
            if (!text.match(/^(http|https):\/\/[^ "]+$/)) {
                return;
            }

            urlInput.value = text;
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }

    async function handleSearchBtnClick () {
        const url = urlInput.value.trim();

        if (!url) {
            return;
        }

        const icon = lucide.createElement(lucide.LoaderCircle);

        icon.setAttribute('class', 'animate-spin h-5 w-5');

        // Show loading state
        searchBtn.innerHTML = ``;
        searchBtn.appendChild(icon);
        searchBtn.disabled = true;
        pasteBtn.disabled = true;
        urlInput.disabled = true;

        videoInfo.innerHTML = ``;

        try {
            const response = await fetch(`/info?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (response.status >= 400) {
                videoInfo.append(errorAlert(data.message || 'Error al obtener la información del video'));
                setTimeout(() => {
                    videoInfo.innerHTML = ``;
                    urlInput.value = ``;
                    urlInput.focus();
                }, 10000);
                return;
            }

            for (const item of data) {
                videoInfo.appendChild(makeVideoInfo(item));
            }

            // videoInfo.appendChild(makeVideoInfo(data));
        } catch (error) {
            videoInfo.append(errorAlert(error.message || 'Error al obtener la información del video'));
            setTimeout(() => {
                videoInfo.innerHTML = ``;
                urlInput.value = ``;
                urlInput.focus();
            }, 10000);
        } finally {
            const icon = lucide.createElement(lucide.Search);

            icon.setAttribute('class', 'h-5 w-5');

            searchBtn.innerHTML = ``;
            searchBtn.appendChild(icon);

            searchBtn.disabled = false;
            urlInput.disabled = false;
            pasteBtn.disabled = false;
        }
    }

    function handleInputPaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        urlInput.value = text;
        searchBtn.click();
    }

    pasteBtn.addEventListener('click', handlePasteBtnClick);
    searchBtn.addEventListener('click', handleSearchBtnClick);
    urlInput.addEventListener('paste', handleInputPaste);
})();
