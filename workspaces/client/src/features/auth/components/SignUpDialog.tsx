import { BetterFetchError } from '@better-fetch/fetch';
import { FORM_ERROR } from 'final-form';
import { useId } from 'react';
import { Field, Form } from 'react-final-form';
import { z } from 'zod';

import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { isValidEmail } from '@wsh-2025/client/src/features/auth/logics/isValidEmail';
import { isValidPassword } from '@wsh-2025/client/src/features/auth/logics/isValidPassword';
import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';

interface SignInFormValues {
  email: string;
  password: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignIn: () => void;
}

export const SignUpDialog = ({ isOpen, onClose, onOpenSignIn }: Props) => {
  const authActions = useAuthActions();
  const emailId = useId();
  const passwordId = useId();

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await authActions.signUp({
        email: values.email,
        password: values.password,
      });

      alert('新規会員登録に成功しました');
      onClose();
      return;
    } catch (e) {
      if (e instanceof BetterFetchError && e.status === 400) {
        return { [FORM_ERROR]: '入力した情報が正しくありません' };
      }
      return { [FORM_ERROR]: '不明なエラーが発生しました' };
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="size-full">
        <div className="mb-4 flex w-full flex-row justify-center">
          <img className="object-contain" height={36} loading="lazy" src="/public/arema.svg" width={98} />
        </div>

        <h2 className="mb-6 text-center text-6 font-bold">会員登録</h2>

        <Form
          validate={(values) => {
            const schema = z.object({
              email: z
                .string({ required_error: 'メールアドレスを入力してください' })
                .and(z.custom(isValidEmail, { message: 'メールアドレスが正しくありません' })),
              password: z
                .string({ required_error: 'パスワードを入力してください' })
                .and(z.custom(isValidPassword, { message: 'パスワードが正しくありません' })),
            });
            const result = schema.safeParse(values);
            return result.success ? undefined : result.error.formErrors.fieldErrors;
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, hasValidationErrors, submitError, submitting }) => (
            <form className="mb-4" onSubmit={(ev) => void handleSubmit(ev)}>
              <Field name="email">
                {({ input, meta }) => {
                  return (
                    <div className="mb-6">
                      <div className="mb-2 flex flex-row items-center justify-between text-3.5 font-bold">
                        <label className="shrink-0 grow-0" htmlFor={emailId}>
                          メールアドレス
                        </label>
                        {meta.modified && Array.isArray(meta.error) ? (
                          <span className="shrink-0 grow-0 text-[#F0163A]">{meta.error[0]}</span>
                        ) : null}
                      </div>
                      <input
                        {...input}
                        required
                        className="rounded-1 w-full border-0.5 border-solid border-[#FFFFFF1F] bg-white p-3 text-3.5 text-[#212121] placeholder:text-[#999999]"
                        id={emailId}
                        placeholder="メールアドレスを入力"
                        type="email"
                      />
                    </div>
                  );
                }}
              </Field>

              <Field name="password">
                {({ input, meta }) => {
                  return (
                    <div className="mb-6">
                      <div className="mb-2 flex flex-row items-center justify-between text-3.5 font-bold">
                        <label className="shrink-0 grow-0" htmlFor={passwordId}>
                          パスワード
                        </label>
                        {meta.modified && Array.isArray(meta.error) ? (
                          <span className="shrink-0 grow-0 text-[#F0163A]">{meta.error[0]}</span>
                        ) : null}
                      </div>
                      <input
                        {...input}
                        required
                        className="rounded-1 w-full border-0.5 border-solid border-[#FFFFFF1F] bg-white p-3 text-3.5 text-[#212121] placeholder:text-[#999999]"
                        id={passwordId}
                        placeholder="パスワードを入力"
                        type="password"
                      />
                    </div>
                  );
                }}
              </Field>

              {submitError ? (
                <div className="rounded-1 mb-2 flex w-full flex-row items-center justify-start border-0.5 border-solid border-[#F0163A] bg-[#ffeeee] p-2 text-3.5 font-bold text-[#F0163A]">
                  <div className="i-material-symbols:error-outline m-1 size-[20px]" />
                  <span>{submitError}</span>
                </div>
              ) : null}

              <div className="flex flex-row justify-center">
                <button
                  className="rounded-1 block flex w-[160px] flex-row items-center justify-center bg-[#1c43d1] p-3 text-3.5 font-bold text-white disabled:opacity-50"
                  disabled={submitting || hasValidationErrors}
                  type="submit"
                >
                  アカウント作成
                </button>
              </div>
            </form>
          )}
        </Form>

        <div className="flex flex-row justify-center">
          <button
            className="block bg-transparent text-3.5 text-[#999999] underline"
            type="button"
            onClick={onOpenSignIn}
          >
            既にあるアカウントにログインする
          </button>
        </div>
      </div>
    </Dialog>
  );
};
