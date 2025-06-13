
import notFoundImage from "../assets/notFound.png"; // Placeholder image for no listings
export default function noListing() {
   const STYLE = {
      display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh", /* Tam ekran yüksekliği */

   }
  return (

      <div className="no-listings-container" style={STYLE}>
       <h1>Listelenecek bir öğe Bulunamadı.</h1>
       <img src={notFoundImage} alt="No Listings" className="no-listings-image" style={{width:"50vh",height:"auto"}}/>
      </div>

  )
}

