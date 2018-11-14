import * as assert from 'assert'
import * as fs from 'fs'
import { Rgba, CompositeMode, COMPOSITE_NORMAL } from '@rgba-image/common'
import { createImage } from '@rgba-image/create-image'
import { fromPng, toPng } from '@rgba-image/png'
import { line, bresenhamLine } from '..'

type LinePoints = [ number, number, number, number ]

const lineHelper = ( dest: ImageData, linePoints: LinePoints, color: Rgba, compositeMode: CompositeMode ) => {
  const [ x0, y0, x1, y1 ] = linePoints
  const [ r, g, b, a ] = color

  if( compositeMode === COMPOSITE_NORMAL ){
    line( dest, x0, y0, x1, y1, r, g, b, a )
  } else {
    line( dest, x0, y0, x1, y1, r, g, b, a, compositeMode )
  }
}

const bresenhamHelper = ( dest: ImageData, linePoints: LinePoints, color: Rgba, compositeMode: CompositeMode ) => {
  const [ x0, y0, x1, y1 ] = linePoints
  const [ r, g, b, a ] = color

  if ( compositeMode === COMPOSITE_NORMAL ) {
    bresenhamLine( dest, x0, y0, x1, y1, r, g, b, a )
  } else {
    bresenhamLine( dest, x0, y0, x1, y1, r, g, b, a, compositeMode )
  }
}

describe( 'line', () => {
  const lineNwToSe: LinePoints = [ 8, 8, 56, 56 ]
  const lineNeToSw: LinePoints = [ 56, 8, 8, 56 ]
  const lineHorizontalTop: LinePoints = [ 4, 12, 60, 12 ]
  const lineHorizontalMiddle: LinePoints = [ 4, 32, 60, 32 ]
  const color: Rgba = [ 51, 153, 255, 191 ]

  describe( 'line', () => {
    it( 'composites', () => {
      const dest = createImage( 64, 64 )

      lineHelper( dest, lineNwToSe, color, COMPOSITE_NORMAL )
      lineHelper( dest, lineNeToSw, color, COMPOSITE_NORMAL )
      lineHelper( dest, lineHorizontalTop, color, COMPOSITE_NORMAL )
      lineHelper( dest, lineHorizontalMiddle, color, COMPOSITE_NORMAL )

      const png = toPng( dest )

      fs.writeFileSync( './src/test/fixtures/line-composite-normal.png', png )
    } )

    it( 'no compositing', () => {
      const dest = createImage( 64, 64 )

      lineHelper( dest, lineNwToSe, color, -1 )
      lineHelper( dest, lineNeToSw, color, -1 )
      lineHelper( dest, lineHorizontalTop, color, -1 )
      lineHelper( dest, lineHorizontalMiddle, color, -1 )

      const png = toPng( dest )

      fs.writeFileSync( './src/test/fixtures/line-no-composite.png', png )
    })
  })

  describe( 'bresenhamLine', () => {
    it( 'composites', () => {
      const dest = createImage( 64, 64 )

      bresenhamHelper( dest, lineNwToSe, color, COMPOSITE_NORMAL )
      bresenhamHelper( dest, lineNeToSw, color, COMPOSITE_NORMAL )
      bresenhamHelper( dest, lineHorizontalTop, color, COMPOSITE_NORMAL )
      bresenhamHelper( dest, lineHorizontalMiddle, color, COMPOSITE_NORMAL )

      const png = toPng( dest )

      fs.writeFileSync( './src/test/fixtures/bresenham-composite-normal.png', png )
    } )

    it( 'no compositing', () => {
      const dest = createImage( 64, 64 )

      bresenhamHelper( dest, lineNwToSe, color, -1 )
      bresenhamHelper( dest, lineNeToSw, color, -1 )
      bresenhamHelper( dest, lineHorizontalTop, color, -1 )
      bresenhamHelper( dest, lineHorizontalMiddle, color, -1 )

      const png = toPng( dest )

      fs.writeFileSync( './src/test/fixtures/bresenham-no-composite.png', png )
    } )
  } )
})