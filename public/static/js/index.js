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
    const url = urlInput.value.trim();
    if (!url) return;

    const icon = lucide.createElement(lucide.LoaderCircle);

    icon.setAttribute('class', 'animate-spin h-5 w-5');

    downloadBtn.innerHTML = ``;
    downloadBtn.textContent = 'Descargando...';
    downloadBtn.prepend(icon);
    downloadBtn.disabled = true;

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url}),
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
        downloadBtn.textContent = 'Descargar';
        downloadBtn.prepend(downloadIcon);
        downloadBtn.disabled = false;
    }
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
    const downloadBtn = document.createElement('button');
    const downloadIcon = lucide.createElement(lucide.Download);

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
    downloadBtn.classList.add(
        'w-full',
        'px-6',
        'py-3',
        'bg-green-500',
        'text-white',
        'rounded-lg',
        'hover:bg-green-600',
        'transition-colors',
        'duration-200',
        'flex',
        'items-center',
        'justify-center',
    );

    downloadIcon.setAttribute('class', 'h-5 w-5 mr-2');
    downloadBtn.textContent = 'Descargar';
    downloadBtn.prepend(downloadIcon);
    downloadBtn.addEventListener('click', handleDownload);

    containerinfoInner.appendChild(title);
    containerinfoInner.appendChild(duration);
    containerinfoInner.appendChild(description);

    containerInfo.appendChild(containerinfoInner);
    containerInfo.appendChild(downloadBtn);

    containerThumbnail.appendChild(thumbnail);

    container.appendChild(containerThumbnail);
    container.appendChild(containerInfo);

    return container;
}

pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        urlInput.value = text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
});

searchBtn.addEventListener('click', async (e) => {
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

        videoInfo.appendChild(makeVideoInfo(data));
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
});

// Detectar URLs pegadas
urlInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    urlInput.value = text;
    searchBtn.click();
});
