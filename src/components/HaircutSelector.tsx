import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface HaircutSelectorProps {
  open: boolean;
  onClose: () => void;
  onContinue: (selectedHaircut: string) => void;
  selectedTime: string | null;
}

const HaircutSelector: React.FC<HaircutSelectorProps> = ({
  open,
  onClose,
  onContinue,
  selectedTime
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [selectedHaircut, setSelectedHaircut] = useState<string>("");
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Generate haircut image names
  const haircutImages = Array.from({ length: 9 }, (_, i) => ({
    id: `haircut${i + 1}`,
    // src: `./content/img/haircut${i + 1}.png`,
    src: `/assets/images/haircut${i + 1}.png`, // Adjust path as needed
    name: `תסרוקת ${i + 1}`
  }));

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < haircutImages.length - 1) {
      goToNext();
    }
    if (isRightSwipe && currentImageIndex > 0) {
      goToPrevious();
    }
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < haircutImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleImageSelect = (haircutId: string) => {
    setSelectedHaircut(haircutId);
  };

  const handleContinue = () => {
    if (!selectedHaircut) {
      alert("אנא בחר תסרוקת לפני המשך");
      return;
    }
    onContinue(selectedHaircut);
  };

  const handleClose = () => {
    setCurrentImageIndex(0);
    setSelectedHaircut("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      style={{ fontFamily: "Arial" }}
    >
      <DialogTitle
        style={{
          direction: "rtl",
          textAlign: "center",
          fontSize: "1.65rem",
          fontWeight: "bold",
          color: "#333",
          borderBottom: "2px solid #ddd",
          paddingBottom: "15px",
          position: "relative"
        }}
      >
        בחר את התסרוקת שלך
        
        {/* Exit Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#666",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f0f0f0";
            e.currentTarget.style.color = "#333";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#666";
          }}
        >
          ✕
        </button>
      </DialogTitle>

      <DialogContent style={{ direction: "rtl", padding: "30px 20px" }}>
        {/* Time Display */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #ddd"
          }}
        >
          <p style={{ margin: "0", fontSize: "1.1rem", color: "#666" }}>
            שעת התור: <strong style={{ color: "#333" }}>{selectedTime}</strong>
          </p>
        </div>

        {/* Image Slider */}
        <div
          style={{
            position: "relative",
            marginBottom: "30px",
            border: "2px solid #ddd",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#f8f9fa"
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            disabled={currentImageIndex === 0}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              cursor: currentImageIndex === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              opacity: currentImageIndex === 0 ? 0.3 : 1,
              transition: "all 0.3s ease"
            }}
          >
            ›
          </button>

          {/* Image Container */}
          <div
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: "relative",
              height: "300px",
              overflow: "hidden",
              touchAction: "pan-y",
              userSelect: "none"
            }}
          >
            <img
              src={haircutImages[currentImageIndex].src}
              alt={haircutImages[currentImageIndex].name}
              style={{
                width: "100%",
                height: "50vh",
                objectFit: "cover",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onClick={() => handleImageSelect(haircutImages[currentImageIndex].id)}
            />
            
            {/* Selection Indicator */}
            {selectedHaircut === haircutImages[currentImageIndex].id && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  background: "rgba(76, 175, 80, 0.3)",
                  border: "4px solid #4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem"
                }}
              >
                ✓
              </div>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            disabled={currentImageIndex === haircutImages.length - 1}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(0,0,0,0.6)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              cursor: currentImageIndex === haircutImages.length - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              opacity: currentImageIndex === haircutImages.length - 1 ? 0.3 : 1,
              transition: "all 0.3s ease"
            }}
          >
            ‹
          </button>

          {/* Image Counter */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "5px 15px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            {currentImageIndex + 1} / {haircutImages.length}
          </div>
        </div>

        {/* Image Name */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h3
            style={{
              margin: "0",
              fontSize: "1.3rem",
              color: "#333",
              fontWeight: "bold"
            }}
          >
            {haircutImages[currentImageIndex].name}
          </h3>
          <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
            לחץ על התמונה לבחירה
          </p>
        </div>

        {/* Image Dots Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "30px"
          }}
        >
          {haircutImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                background: index === currentImageIndex ? "#4CAF50" : "#ddd",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>

        {/* Selection Status */}
        {selectedHaircut && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              background: "#E8F5E8",
              borderRadius: "8px",
              border: "1px solid #4CAF50"
            }}
          >
            <p style={{ margin: "0", fontSize: "1.1rem", color: "#2E7D32" }}>
              ✓ נבחרה: {haircutImages.find(img => img.id === selectedHaircut)?.name}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "20px"
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: "12px 30px",
              borderRadius: "8px",
              border: "2px solid #ddd",
              background: "white",
              color: "#666",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: "120px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.borderColor = "#999";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#ddd";
            }}
          >
            ביטול
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedHaircut}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: selectedHaircut ? "black" : "#e0e0e0",
              color: selectedHaircut ? "white" : "#999",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: selectedHaircut ? "pointer" : "not-allowed",
              minWidth: "120px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (selectedHaircut) {
                e.currentTarget.style.background = "#45a049";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedHaircut) {
                e.currentTarget.style.background = "#4CAF50";
              }
            }}
          >
            המשך לאישור
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HaircutSelector;