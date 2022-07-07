/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then testest", () => {
      const html = NewBillUI()
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      const submit = screen.getByTestId('form-new-bill')
      const file = screen.getByTestId('file')
      submit.addEventListener('click', handleSubmit)
      userEvent.click(submit)
      expect(handleSubmit).toHaveBeenCalled()
      const fakeFile = new File([''], 'hello.png', { type: 'image/png' });
      
    })
  })
})
