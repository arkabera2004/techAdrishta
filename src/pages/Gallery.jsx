// src/pages/Gallery.jsx
import DomeGallery from '../components/DomeGallery';
import RetroTV from '../components/RetroTV';

export default function Gallery() {
  return (
    <main style={styles.page}>
      <div style={{ height: '100svh', width: '100%' }}>
        <DomeGallery
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={true}
        />
      </div>
      <div style={{ width: '50%', margin: '0 auto', paddingBottom: '4rem' }}>
        <RetroTV
          videos={[
            { name: "video1", videoUrl: "/videos/video1.mov" },
            { name: "video2", videoUrl: "/videos/video2.mov" },
            { name: "video3", videoUrl: "/videos/video3.mov" },
            { name: "video4", videoUrl: "/videos/video4.mov" },
          ]}
        />
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100svh',
    width: '100vw',
    background: '#08080c',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
};
