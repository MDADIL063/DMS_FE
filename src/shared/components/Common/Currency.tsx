import { AppDefaults, CurrencyCode } from "../../../data/app.constant";
import { UtilService } from "../../../services/util.service";

interface IProps {
  value: number | null | undefined;
  currencyCode?: `${CurrencyCode}`;
}

const Currency = ({ value, currencyCode = CurrencyCode.INDIA }: IProps) => {
  const utilSvc = new UtilService();

  return (
    <>
      {currencyCode === CurrencyCode.INDIA ? (
        <>
          {AppDefaults.RUPEE_SYMBOL}
          {utilSvc.formatCurrency(value || 0)}
        </>
      ) : null}
    </>
  );
};

export default Currency;
