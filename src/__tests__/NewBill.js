/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
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
    test("Then I can submit a bill", async() => {
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

      screen.getByTestId('commentary').value = 'test'

      
      const formSubmission = screen.getByTestId("form-new-bill")

      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))

      formSubmission.addEventListener('submit', handleSubmit)

      fireEvent.submit(formSubmission)

      expect(handleSubmit).toHaveBeenCalled()
      
    })
  // test d'intégration POST

    test('create a new bill from mock API POST', async () => {

      const bill = [{

        "id": "47qAXb6fIm2zOKkLzMro",

        "vat": "80",

        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",

        "status": "pending",

        "type": "Hôtel et logement",

        "commentary": "séminaire billed",

        "name": "encore",

        "fileName": "preview-facture-free-201801-pdf-1.jpg",

        "date": "2004-04-04",

        "amount": 400,

        "commentAdmin": "ok",

        "email": "a@a",

        "pct": 20

      }]

      const callStore = jest.spyOn(store, 'bills');

      store.bills().create(bill);

      expect(callStore).toHaveBeenCalled();

    });
  })
})
