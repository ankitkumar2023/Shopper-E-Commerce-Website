import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
      <>
          <div className="descriptionbox">
              <div className="descriptionbox-navigator">
                  <div className="descriptionbox-nav-box">Description</div>
                  <div className="descriptionbox-nav-box fade">REviews (122)</div>
              </div>
              <div className="descriptionbox-description">
                  <p>Upgrade your wardrobe with the versatile and stylish [Product Name],
                      a perfect blend of comfort, quality, and elegance. Carefully crafted from premium [material, e.g.,
                      cotton, polyester, silk, etc.], this piece is designed to suit a variety of occasions,
                      whether you're heading out for a casual brunch, a formal meeting, or a night out with friends.
                      Its timeless design and superior craftsmanship make it an essential addition to any closet.</p>
              </div>
          </div>
      </>
  )
}

export default DescriptionBox
