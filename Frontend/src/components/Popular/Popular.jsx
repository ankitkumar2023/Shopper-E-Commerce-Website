import React from 'react'
import './Popular.css'
import product_data from '../Assets/data'
import Item from '../Item/Item'

function Popular() {
  return (
      <>
          <div className='popular'>
              <h1>POPULAR IN WOMEN</h1>
              <hr />
              <div className="popular-item">
                  {product_data.map((item,i) => {
                      return (<Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />)
                })}  
              </div>
              
          </div>
      </>
  )
}

export default Popular