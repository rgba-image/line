import { rgbaToUint32, isLittleEndian, CompositeMode, COMPOSITE_NORMAL } from '@rgba-image/common'
import { compositeRgbaUint32 } from '@rgba-image/color'

export type Line = (
  dest: ImageData,
  x0: number, y0: number, x1: number, y1: number,
  r: number, g: number, b: number, a: number,
  compositeMode?: CompositeMode
) => void

// todo change to optionally take CompositeRgbaUint32

export const line: Line = ( dest: ImageData, x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a: number, compositeMode: CompositeMode = COMPOSITE_NORMAL ) => {
  if ( x0 === x1 && y0 === y1 ) {
    return
  }

  r = r | 0
  g = g | 0
  b = b | 0
  a = a | 0

  const destData = new Uint32Array( dest.data.buffer )

  const plot = ( x: number, y: number, alpha: number ) => {
    const index = y * dest.width + x

    let v: number

    if ( compositeMode === -1 ) {
      v = rgbaToUint32( r, g, b, a * alpha, isLittleEndian )
    } else {
      const channelIndex = index * 4

      const sR = dest.data[ channelIndex ]
      const sG = dest.data[ channelIndex + 1 ]
      const sB = dest.data[ channelIndex + 2 ]
      const sA = dest.data[ channelIndex + 3 ]

      v = compositeRgbaUint32( sR, sG, sB, sA, r, g, b, a * alpha, compositeMode )
    }

    destData[ index ] = v
  }

  const isSteep = Math.abs( y1 - y0 ) > Math.abs( x1 - x0 )

  if ( isSteep ) {
    [ y0, x0 ] = [ x0, y0 ];
    [ y1, x1 ] = [ x1, y1 ]
  }

  if ( x0 > x1 ) {
    [ x1, x0 ] = [ x0, x1 ];
    [ y1, y0 ] = [ y0, y1 ]
  }

  const dx = x1 - x0
  const dy = y1 - y0
  const gradient = dy / dx

  let xEnd = round( x0 )
  let yEnd = y0 + gradient * ( xEnd - x0 )
  let xGap = reverseFraction( x0 + 0.5 )
  const xPx1 = xEnd
  const yPx1 = integerPart( yEnd )

  if ( isSteep ) {
    plot( yPx1, xPx1, reverseFraction( yEnd ) * xGap )
    plot( yPx1 + 1, xPx1, fraction( yEnd ) * xGap )
  } else {
    plot( xPx1, yPx1, reverseFraction( yEnd ) * xGap )
    plot( xPx1, yPx1 + 1, fraction( yEnd ) * xGap )
  }

  let intery = yEnd + gradient

  xEnd = round( x1 )
  yEnd = y1 + gradient * ( xEnd - x1 )
  xGap = fraction( x1 + 0.5 )

  const xPx2 = xEnd
  const yPx2 = integerPart( yEnd )

  if ( isSteep ) {
    plot( yPx2, xPx2, reverseFraction( yEnd ) * xGap )
    plot( yPx2 + 1, xPx2, fraction( yEnd ) * xGap )
  } else {
    plot( xPx2, yPx2, reverseFraction( yEnd ) * xGap )
    plot( xPx2, yPx2 + 1, fraction( yEnd ) * xGap )
  }

  if ( isSteep ) {
    for ( let x = xPx1 + 1; x <= xPx2 - 1; x++ ) {
      plot( integerPart( intery ), x, reverseFraction( intery ) )
      plot( integerPart( intery ) + 1, x, fraction( intery ) )
      intery = intery + gradient
    }
  } else {
    for ( let x = xPx1 + 1; x <= xPx2 - 1; x++ ) {
      plot( x, integerPart( intery ), reverseFraction( intery ) )
      plot( x, integerPart( intery ) + 1, fraction( intery ) )
      intery = intery + gradient
    }
  }
}

export const bresenhamLine: Line = ( dest: ImageData, x0: number, y0: number, x1: number, y1: number, r: number, g: number, b: number, a: number, compositeMode: CompositeMode = COMPOSITE_NORMAL ) => {
  x0 = x0 | 0
  y0 = y0 | 0
  x1 = x1 | 0
  y1 = y1 | 0
  r = r | 0
  g = g | 0
  b = b | 0
  a = a | 0

  const destData = new Uint32Array( dest.data.buffer )

  if ( x0 >= 0 && y0 >= 0 && x0 < dest.width && y0 < dest.height ) {
    const index = y0 * dest.width + x0

    let v: number

    if ( compositeMode === -1 ) {
      v = rgbaToUint32( r, g, b, a, isLittleEndian )
    } else {
      const channelIndex = index * 4

      const sR = dest.data[ channelIndex ]
      const sG = dest.data[ channelIndex + 1 ]
      const sB = dest.data[ channelIndex + 2 ]
      const sA = dest.data[ channelIndex + 3 ]

      v = compositeRgbaUint32( sR, sG, sB, sA, r, g, b, a, compositeMode )
    }

    destData[ index ] = v
  }

  const dX = Math.abs( x1 - x0 )
  const dY = Math.abs( y1 - y0 )
  const sX = x0 < x1 ? 1 : -1
  const sY = y0 < y1 ? 1 : -1

  let err = dX - dY

  while ( x0 !== x1 || y0 !== y1 ) {
    const err2 = 2 * err

    if ( err2 > dY * -1 ) {
      err -= dY
      x0 += sX
    }

    if ( err2 < dX ) {
      err += dX
      y0 += sY
    }

    if ( x0 >= 0 && y0 >= 0 && x0 < dest.width && y0 < dest.height ) {
      const index = y0 * dest.width + x0

      let v: number

      if ( compositeMode === -1 ) {
        v = rgbaToUint32( r, g, b, a, isLittleEndian )
      } else {
        const channelIndex = index * 4

        const sR = dest.data[ channelIndex ]
        const sG = dest.data[ channelIndex + 1 ]
        const sB = dest.data[ channelIndex + 2 ]
        const sA = dest.data[ channelIndex + 3 ]

        v = compositeRgbaUint32( sR, sG, sB, sA, r, g, b, a, compositeMode )
      }

      destData[ index ] = v
    }
  }
}

const integerPart = ( v: number ) => {
  const isNeg = ( v < 0 ) ? -1 : 1
  const abs = Math.abs( v )
  const integerPart = Math.floor( abs )

  return integerPart * isNeg
}

const fraction = ( v: number ) => {
  if ( v < 0 ) {
    return 1 - ( v - Math.floor( v ) )
  }

  return v - Math.floor( v )
}

const reverseFraction = ( v: number ) => 1 - fraction( v )

const round = ( v: number ) => integerPart( v + 0.5 )
