// src/pages/Gallery.jsx
import DomeGallery from '../components/DomeGallery';

export default function Gallery() {
  return (
    <main style={styles.page}>
      <DomeGallery
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
        grayscale={true}
      />
    </main>
  );
}

const styles = {
  page: { 
    height: '100svh', 
    width: '100vw',
    background: '#08080c', 
    overflow: 'hidden'
  }
};
