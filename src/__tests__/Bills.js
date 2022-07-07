/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { formatDate } from "../app/format.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeAll(() => {
      const localBills = JSON.parse(JSON.stringify(bills))
      document.body.innerHTML = BillsUI({ data: localBills })
    })
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const datesExpected = bills.map(bill => bill.date)
      const dates = screen.getAllByTestId('bill-date').map(date => date.textContent)
      const datesSorted = datesExpected.sort((a,b) => new Date(b) - new Date(a)).map(date => formatDate(date))
      console.log('datesSortes: '+datesSorted)
      expect(dates).toEqual(datesSorted)
    })
    describe("When I click on new Bill", () => {
      test("I am redirect to new bill page", () => {
        const newBillButton = screen.getByTestId('btn-new-bill')
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const billsPage = new Bills({
          document, onNavigate, store: null, localStorage: window.localStorage
        })
        const handleClickNewBill = jest.fn((e) => billsPage.handleClickNewBill())
        newBillButton.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillButton)
        expect(handleClickNewBill).toHaveBeenCalled()
      })
    })
  })
})
 