import GuideModal from "../GuideModal/GuideModal";

function GuideWrapper({ uiState, uiSetters }) {
  if (!uiState.showGuide) return null;
  return <GuideModal onClose={() => uiSetters.setShowGuide(false)} />;
}

export default GuideWrapper;
