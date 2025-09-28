import {render, screen} from '@testing-library/react'
import { StaticComponent } from '../../components/staticComponent'

describe("static component", () => {
    it("show the content static component", () => {
        render(<StaticComponent/>)
        expect(screen.getByText('static component')).toBeInTheDocument()
    })
})