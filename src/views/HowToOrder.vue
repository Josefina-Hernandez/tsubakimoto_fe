<template>
    <div class="index">

      <BannerContainer :firstLabel="firstLabel" :ifShowBtn="true" />

      <div class="main-contents">
        <div class="title">
            <h3>How to Order</h3>
        </div>

        <div class="pdf-viewer-container" ref="pdfContainer">
          <div class="pdf-controls">
            <button class="fullscreen-btn" @click="openInNewWindow">
              <span>Fullscreen</span>
            </button>

            <div class="nav-group">
              <button
                class="nav-btn prev-btn"
                @click="prevPage"
                :disabled="currentPage <= 1">
                <span>Previous</span>
              </button>

              <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <button
                class="nav-btn next-btn"
                @click="nextPage"
                :disabled="currentPage >= totalPages">
                <span>Next</span>
              </button>
            </div>
          </div>

          <div class="pdf-wrapper"
               ref="pdfWrapper"
               @touchstart="handleTouchStart"
               @touchend="handleTouchEnd">
            <canvas ref="pdfCanvas" class="pdf-canvas"></canvas>

            <div v-if="isLoading" class="loading-overlay">
              <div class="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          </div>

          <div class="pdf-controls">
            <button class="fullscreen-btn" @click="openInNewWindow">
              <span>Fullscreen</span>
            </button>

            <div class="nav-group">
              <button
                class="nav-btn prev-btn"
                @click="prevPage"
                :disabled="currentPage <= 1">
                <span>Previous</span>
              </button>

              <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <button
                class="nav-btn next-btn"
                @click="nextPage"
                :disabled="currentPage >= totalPages">
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
    import BannerContainer from '@/components/BannerContainer.vue'
    import * as pdfjsLib from 'pdfjs-dist/build/pdf'
    import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

    export default {
        name: 'HowToOrder',
        data() {
            return {
                firstLabel: 'Information',
                pdfDoc: null,
                currentPage: 1,
                totalPages: 0,
                isLoading: true,
                touchStartX: 0,
                touchEndX: 0,
                scale: 1.5,
                pdfUrl: ''
            };
        },

        components: {
            BannerContainer,
        },

        mounted() {
            this.loadPdf();
            window.addEventListener('resize', this.handleResize);
        },

        beforeUnmount() {
            window.removeEventListener('resize', this.handleResize);
        },

        methods: {
            async loadPdf() {
                try {
                    this.isLoading = true;
                    this.pdfUrl = process.env.BASE_URL + 'pdfs/how_to_order.pdf';

                    const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
                    this.pdfDoc = await loadingTask.promise;
                    this.totalPages = this.pdfDoc.numPages;

                    await this.renderPage(this.currentPage);
                } catch (error) {
                    console.error('Error loading PDF:', error);
                } finally {
                    this.isLoading = false;
                }
            },

            async renderPage(pageNum) {
                if (!this.pdfDoc) return;

                try {
                    const page = await this.pdfDoc.getPage(pageNum);
                    const canvas = this.$refs.pdfCanvas;
                    const context = canvas.getContext('2d');

                    // Calculate scale based on container width
                    const containerWidth = this.$refs.pdfWrapper?.clientWidth || 800;
                    const viewport = page.getViewport({ scale: 1 });
                    const scale = (containerWidth - 40) / viewport.width;
                    const scaledViewport = page.getViewport({ scale: Math.min(scale, 2) });

                    canvas.height = scaledViewport.height;
                    canvas.width = scaledViewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: scaledViewport
                    };

                    await page.render(renderContext).promise;
                } catch (error) {
                    console.error('Error rendering page:', error);
                }
            },

            prevPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderPage(this.currentPage);
                }
            },

            nextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.renderPage(this.currentPage);
                }
            },

            handleTouchStart(e) {
                this.touchStartX = e.touches[0].clientX;
            },

            handleTouchEnd(e) {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            },

            handleSwipe() {
                const swipeThreshold = 50;
                const diff = this.touchStartX - this.touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next page
                        this.nextPage();
                    } else {
                        // Swipe right - previous page
                        this.prevPage();
                    }
                }
            },

            openInNewWindow() {
                if (this.pdfUrl) {
                    window.open(this.pdfUrl, '_blank');
                }
            },

            handleResize() {
                if (this.pdfDoc) {
                    this.renderPage(this.currentPage);
                }
            }
        },

    }
</script>

<style scoped lang="less">
    .index {
        margin: 0 auto;
        width: 100%;

        .main-contents{
            margin-left: 5%;
            margin-right: 5%;
            padding-bottom: 40px;

            .title{
                max-width: 1100px;
                margin: 10px auto 5px;
                h3{
                    text-align: left;
                    font-size: 22px;
                    font-weight: bold;
                }
            }

            .pdf-viewer-container {
                max-width: 1100px;
                margin: 0 auto;
                background: #f5f5f5;
                border-radius: 12px;
                padding: 25px;
                box-shadow:
                    0 8px 24px rgba(0, 0, 0, 0.15),
                    0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .pdf-wrapper {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 400px;
                background: #fff;
                border-radius: 6px;
                border: 2px solid rgba(0, 0, 0, 0.2);
                overflow: hidden;
            }

            .pdf-canvas {
                max-width: 100%;
                height: auto;
            }

            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);

                p {
                    margin-top: 15px;
                    color: #666;
                    font-size: 14px;
                }
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e0e0e0;
                border-top-color: #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .pdf-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 15px 0;
            }

            .nav-group {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .nav-btn, .fullscreen-btn {
                width: 140px;
                height: 35px;
                border: none;
                border-radius: 5px;
                color: white;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
                transition: background-color 0.3s, transform 0.3s;

                span {
                    position: relative;
                    top: 0;
                    left: 0;
                    transition: top 0.2s ease, left 0.2s ease;
                }

                &:hover:not(:disabled) {
                    transform: translate(3px, 3px);
                }

                &:hover:not(:disabled) span {
                    top: 2px;
                    left: 2px;
                }

                &:active:not(:disabled) {
                    transform: translate(4px, 4px);
                }

                &:active:not(:disabled) span {
                    top: 3px;
                    left: 3px;
                }
            }

            .nav-btn {
                background-color: #00AAEE;

                &:hover:not(:disabled) {
                    background-color: #0082B3;
                }

                &:active:not(:disabled) {
                    background-color: #006A94;
                }

                &:disabled {
                    background-color: #BFBFBF;
                    cursor: not-allowed;
                    box-shadow: none;
                }
            }

            .fullscreen-btn {
                background-color: #6c757d;

                &:hover {
                    background-color: #5a6268;
                }

                &:active {
                    background-color: #4e555b;
                }
            }

            .page-info {
                font-size: 16px;
                color: #333;
                min-width: 120px;
                text-align: center;
                font-weight: 500;
            }
        }
    }

    @media (max-width: 768px) {
        .index .main-contents {
            margin-left: 3%;
            margin-right: 3%;

            .pdf-viewer-container {
                padding: 12px;
            }

            .pdf-controls {
                flex-direction: column;
                gap: 12px;
                margin: 12px 0;
            }

            .nav-group {
                gap: 8px;
            }

            .nav-btn, .fullscreen-btn {
                width: 100px;
                height: 32px;
                font-size: 13px;
            }

            .page-info {
                font-size: 13px;
                min-width: 85px;
            }
        }
    }
</style>
