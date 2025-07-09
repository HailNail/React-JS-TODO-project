import "./Header.css";

// This component displays the header of the application
// It includes a welcome message and a motivational quote from Marcus Aurelius

const Header = () => {
  return (
    <>
      <div className="header-container">
        <div id="quote">
          <p>
            "You have power over your mind - not outside events. Realize this,
            and you will find strength."
          </p>
        </div>
        <div id="author">
          <p>
            <a
              href="https://www.goodreads.com/author/quotes/17212.Marcus_Aurelius"
              target="_blank"
              className="link"
            >
              ― Marcus Aurelius, Meditations
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
