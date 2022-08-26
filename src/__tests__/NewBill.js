/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import store from "../__mocks__/store";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can change file", () => {
      const html = NewBillUI()
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a.fr"
      }))
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, store: store, localStorage: window.localStorage
      })
      const file = screen.getByTestId('file')

      const fakeFile = new File([''], 'hello.png', { type: 'image/png' });
      
      fireEvent.change(file, { target: { files: [fakeFile] } });
      expect(file.files[0]).toEqual(fakeFile)
      
    }),
    test("Then I can submit a bill", () => {
      const html = NewBillUI()
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a.fr"
      }))
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBill = new NewBill({
        document, onNavigate, store: store, localStorage: window.localStorage
      })
      
      const file = screen.getByTestId('file')

      const fakeFile = new File([''], 'hello.png', { type: 'image/png' });
      
      fireEvent.change(file, { target: { files: [fakeFile] } });

      expect(file.files[0]).toEqual(fakeFile)
      
      screen.getByTestId('amount').value = '100'
      
      screen.getByTestId('datepicker').value = '2020-01-01'

      screen.getByTestId('vat').value = '20'

      screen.getByTestId('pct').value = '20'

      screen.getByTestId('expense-type').value = 'Food'

      screen.getByTestId('expense-name').value = 'Restaurant'

      fireEvent.submit(screen.getByTestId('form-new-bill'))
      
    })
  })
})
